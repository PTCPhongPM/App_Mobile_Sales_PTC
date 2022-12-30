import dayjs from "dayjs";
import groupBy from "lodash/groupBy";
import isEqual from "lodash/isEqual";
import orderBy from "lodash/orderBy";
import pick from "lodash/pick";
import pickBy from "lodash/pickBy";

import currencyFormat from "currency-formatter";

import {
  DiscountTypeObject,
  ExtendedFormalityObj,
  SaleProcesses,
  SaleProcessIndexes,
} from "./constants";

export const removeAccents = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");

export const groupByKey = (data, key, orderby = "asc") => {
  if (data.length === 0) return [];

  let temp;
  if (key === "firstName") {
    temp = groupBy(data, (e) => e.firstName[0].toUpperCase());
  } else {
    temp = groupBy(data, key);
  }

  return orderBy(
    Object.entries(temp).map(([key, value]) => ({
      title: key === "undefined" ? "#" : key,
      data: value,
    })),
    "title",
    orderby
  );
};

const filterByTime = (from, to, list) => {
  if (from) {
    list = list.filter((item) => dayjs(item.createdAt).isAfter(dayjs(from)));
  }

  if (to) {
    list = list.filter((item) => dayjs(item.createdAt).isBefore(dayjs(to)));
  }

  return list;
};

export const filterCustomerList = (data, filter, query) => {
  // filter by

  // pick query
  const { from, to, ...q } = pickBy(query, (v) => v !== null && v !== "");

  // filter data
  const _filter = removeAccents(filter.toLowerCase());

  let result = data.filter((item) => {
    // pick item
    const temp = pick(item, Object.keys(q));
    if (
      isEqual(temp, q) &&
      removeAccents([item.lastName, item.firstName].join(" "))
        .toLowerCase()
        .includes(_filter)
    ) {
      return item;
    }
  });

  result = filterByTime(from, to, result);

  return result;
};

export const groupCustomers = (data, sortby, orderby, filter, query) => {
  const sortedData = orderBy(data, "createdAt", orderby);

  const normData = sortedData.map((e) => {
    const sale = e.sales?.[0];

    const processIndex =
      !sale?.favoriteModels || !sale.favoriteModels.length
        ? -1
        : sale.favoriteModels[0].processIndex;

    const process =
      !sale?.favoriteModels || !sale.favoriteModels.length
        ? null
        : sale.favoriteModels[0].process;

    return {
      ...e,
      firstLetter: e.firstName[0].toUpperCase(),
      updatedDate: sale?.updatedAt ? formatDate(sale.updatedAt) : e.updatedDate,
      processIndex: processIndex,
      process: process,
    };
  });

  const filteredData = filterCustomerList(normData, filter, { ...query });

  const groupedData = groupBy(filteredData, sortby);

  let _sortBy = "title";
  if (sortby === "processIndex") _sortBy = "processIndex";
  if (sortby === "createdDate") _sortBy = "createdDate";

  return orderBy(
    Object.entries(groupedData).map(([key, value]) => {
      const title =
        key === "undefined" || key === "-1"
          ? "#"
          : sortby === "processIndex"
          ? SaleProcesses[SaleProcessIndexes[key]]
          : key;

      return {
        title,
        processIndex: key,
        createdDate: data.createdDate,
        data: value,
      };
    }),
    _sortBy,
    orderby
  );
};

export const toISO = (date) => new Date(date).toISOString();
export const formatDate = (date) =>
  date ? dayjs(date).format("DD/MM/YYYY") : "";
export const formatTime = (time) => dayjs(time, "HH:mm:ss").format("HH:mm");
export const formatFilter = (time) =>
  time ? dayjs(time).startOf("d").toISOString() : null;

export const upperFirst = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const capitalizeWords = (word) =>
  word
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const getCustomerName = (customer) =>
  capitalizeWords([customer?.lastName, customer?.firstName].join(" ").trim());

/**
 * Create files array when create of edit test drive
 *  at PUT testdrive/file
 *
 * @param {Object} file
 */
export const getTestDriveUploadFiles = (file) => {
  if (!file) return;

  return [
    { fileId: file.identityCardFront.id, type: "identityCardFront" },
    { fileId: file.identityCardBack.id, type: "identityCardBack" },
    { fileId: file.driveLicenseFront.id, type: "driveLicenseFront" },
    { fileId: file.driveLicenseBack.id, type: "driveLicenseBack" },
    ...(file.disclaimers?.map((e) => ({ fileId: e.id, type: "disclaimers" })) ||
      []),
    ...(file.other?.map((e) => ({ fileId: e.id, type: "other" })) || []),
  ];
};

export const obj2WheelItems = (obj) =>
  Object.entries(obj).map(([value, label]) => ({ value, label }));

export const arr2WheelItems = (arr) => arr.map((e) => ({ label: e, value: e }));

export const getFile = (files, type) => {
  const file = files?.find((e) => e.type === type);

  if (!file) return null;

  return { ...file.file, fileType: type };
};

export const discountFormatter = (value, discountType) => {
  if (value) {
    if (discountType === DiscountTypeObject.number) {
      return `${currencyFormat.format(value, {
        precision: 0,
        locale: "vi-VN",
        symbol: "",
      })}đ`;
    }

    return `${value}%`;
  }
};

export const currencyFormatter = (value) => {
  const tmp = !value || Number.isNaN(value) ? 0 : value;
  return `${currencyFormat.format(tmp, {
    precision: 0,
    locale: "vi-VN",
    symbol: "",
  })}đ`;
};

export const yearsFormatter = (value) => value && `${value} năm`;
export const monthsFormatter = (value) => value && `${value} tháng`;
export const percentageFormatter = (value) => value && `${value}%`;
export const dateFormatter = (value) =>
  value && dayjs(value, "YYYY-MM-DD").format("DD/MM/YYYY");

export const computeDiscountNumber = (total, discount, discountType) => {
  if (!total || Number.isNaN(total)) return 0;
  if (!discount || Number.isNaN(discount)) return 0;

  if (discountType === DiscountTypeObject.number) {
    return discount;
  }

  return (total * discount) / 100;
};

export const computeTotalNumber = (total, discount) => {
  if (!total || Number.isNaN(total)) return 0;

  return total - discount;
};

export const getNewIds = (arr) =>
  arr ? arr.filter((e) => e.isNew).map((e) => e.id) : [];

export const computeResultTotal = (items) => {
  const result = {
    sell: 0,
    gift: 0,
  };

  if (!items) return result;

  items.forEach((element) => {
    const formality = element.formality || element.method;
    if (formality === ExtendedFormalityObj.sell) {
      result.sell += element.total;
    } else {
      result.gift += element.total;
    }
  });

  return result;
};

export const toDate = (value) => (value ? new Date(value) : null);

export const computeMarkedDate = (markedDates) => {
  const result = {};
  if (!markedDates) return result;

  markedDates.forEach((element) => {
    result[element] = {
      marked: true,
    };
  });

  return result;
};

/**
 *
 * @param {Array} data array
 * @param {object} query query has from/to
 */
export const filterData = (data, query) => {
  // pick query
  const { from, to, ...q } = pickBy(query, (v) => v !== null && v !== "");

  // filter

  let result = data.filter((item) => {
    // pick item
    const temp = pick(item, Object.keys(q));
    if (isEqual(temp, q)) {
      return item;
    }
  });

  result = filterByTime(from, to, result);

  return result;
};

export const groupTestDrives = (data, sortby, orderby, query) => {
  const sortedData = orderBy(data, "createdAt", orderby);

  const normData = sortedData.map((e) => ({
    ...e,
    createdAt: formatDate(e.createdAt),
    createdDate: e.createdAt,
    firstLetter: e.customer.firstName[0].toUpperCase(),
  }));

  const filteredData = filterData(normData, query);

  const groupedData = groupBy(filteredData, sortby);

  return orderBy(
    Object.entries(groupedData).map(([key, value]) => ({
      title: key === "undefined" || key === "-1" ? "#" : key,
      createdDate: data.createdDate,
      data: value,
    })),
    sortby === "createdAt" ? "createdDate" : "title",
    orderby
  );
};

export const groupDelivery = (data, sortby, orderby, query) => {
  const sortedData = orderBy(data, "createdAt", orderby);

  const normData = sortedData.map((e) => ({
    ...e,
    createdAt: formatDate(e.createdAt),
    createdDate: e.createdAt,
    firstLetter: e.contract.customer.firstName[0].toUpperCase(),
  }));

  const filteredData = filterData(normData, query);

  const groupedData = groupBy(filteredData, sortby);

  return orderBy(
    Object.entries(groupedData).map(([key, value]) => ({
      title: key === "undefined" || key === "-1" ? "#" : key,
      createdDate: data.createdDate,
      data: value,
    })),
    sortby === "createdAt" ? "createdDate" : "title",
    orderby
  );
};

export const checkSaleActive = (customer) =>
  customer.sales?.[0]?.state === "active";

// export const checkSaleActive2 = (sale) => sale.state === "active";

export const checkSaleDone = (customer) =>
  customer.sales?.[0]?.state === "done";

export const checkTaskExpired = (isDone, date, endingTime) =>
  !isDone &&
  dayjs().isAfter(dayjs(`${date} ${endingTime}`, "YYYY-MM-DD HH:mm:ss"));

export const groupContracts = (data, sortby, orderby, query) => {
  const sortedData = orderBy(data, "createdAt", orderby);

  const normData = sortedData.map((e) => ({
    ...e,
    createdDate: formatDate(e.createdAt),
    firstLetter: e.code[0].toUpperCase(),
  }));

  const filteredData = filterData(normData, query);

  const groupedData = groupBy(
    filteredData,
    sortby === "createdAt" ? "createdDate" : sortby
  );

  return orderBy(
    Object.entries(groupedData).map(([key, value]) => ({
      title: key === "undefined" || key === "-1" ? "#" : key,
      createdDate: data.createdDate,
      data: value,
    })),
    sortby === "createdAt" ? "createdDate" : "title",
    sortby,
    orderby
  );
};
