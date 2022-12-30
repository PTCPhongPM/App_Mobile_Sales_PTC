import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { ScrollView, useWindowDimensions } from "react-native";
import {
  Colors,
  DateTimePicker,
  Switch,
  Text,
  View,
} from "react-native-ui-lib";
import { Controller } from "react-hook-form";

import Headline from "../../../components/Header/Headline";
import InputLabel from "../../../components/Input/InputLabel";
import SelectField from "../../../components/Input/SelectField";
import TextInput from "../../../components/Input/TextInput";

import gStyles from "../../../configs/gStyles";

import { Calendar } from "../../../configs/assets";
import { CustomerTypes } from "../../../helper/constants";
import { toDate } from "../../../helper/utils";

const RequestCustomerTab = ({ form, navigation }) => {
  const { height } = useWindowDimensions();

  const {
    control,
    formState: { errors },
    setValue,
    watch,
  } = form;

  const holderInfo = watch("holderInfo");
  const holderType = watch("holderType");
  const holderProvince = watch("holderInfo.province");
  const holderDistrict = watch("holderInfo.district");

  const isHolder = watch("contactInfo.isHolder");
  const contactProvince = watch("contactInfo.province");
  const contactDistrict = watch("contactInfo.district");

  const handleHolderProvincePicked = useCallback(
    () =>
      navigation.navigate("ProvincePicker", {
        selected: holderProvince,
        onSelect: (province) =>
          setValue("holderInfo.province", province, { shouldValidate: true }),
      }),
    [navigation, holderProvince, setValue]
  );

  const handleHolderDistrictPicked = useCallback(
    () =>
      navigation.navigate("DistrictPicker", {
        selected: { province: holderProvince, district: holderDistrict },
        onSelect: (district) =>
          setValue("holderInfo.district", district, { shouldValidate: true }),
      }),
    [holderDistrict, navigation, holderProvince, setValue]
  );

  const handleContactProvincePicked = useCallback(
    () =>
      navigation.navigate("ProvincePicker", {
        selected: contactProvince,
        onSelect: (province) =>
          setValue("contactInfo.province", province, { shouldValidate: true }),
      }),
    [navigation, contactProvince, setValue]
  );

  const handleContactDistrictPicked = useCallback(
    () =>
      navigation.navigate("DistrictPicker", {
        selected: { province: contactProvince, district: contactDistrict },
        onSelect: (district) =>
          setValue("contactInfo.district", district, { shouldValidate: true }),
      }),
    [contactDistrict, navigation, contactProvince, setValue]
  );

  const renderDependHolderType = useCallback(() => {
    if (holderType === CustomerTypes.corporate) {
      return (
        <>
          <View row centerV>
            <InputLabel text="Tên công ty" required />
            <View flex-2>
              <Controller
                name="holderInfo.companyName"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    placeholder="Nhập tên công ty"
                    value={value}
                    error={error}
                    isError={Boolean(error)}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
          <View row centerV marginT-10>
            <InputLabel text="Mã số thuế" required />
            <View flex-2>
              <Controller
                name="holderInfo.taxCode"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    placeholder="Nhập mã số thuê"
                    value={value}
                    error={error}
                    isError={Boolean(error)}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
          <View row centerV marginT-10>
            <InputLabel text="Người đại diện" required />
            <View flex-2>
              <Controller
                name="holderInfo.ownerName"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    placeholder="Nhập tên nguời đại diện"
                    value={value}
                    error={error}
                    isError={Boolean(error)}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
          <View row centerV marginT-10>
            <InputLabel text="Chức vụ" required />
            <View flex-2>
              <Controller
                name="holderInfo.ownerTitle"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextInput
                    placeholder="Nhập chức vụ"
                    value={value}
                    error={error}
                    isError={Boolean(error)}
                    onChangeText={onChange}
                  />
                )}
              />
            </View>
          </View>
        </>
      );
    }

    return (
      <>
        <View row centerV>
          <InputLabel text="Họ và tên đệm" />
          <View flex-2>
            <Controller
              name="holderInfo.lastName"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập họ và tên đệm"
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row centerV marginT-10>
          <InputLabel text="Tên khách hàng" required />
          <View flex-2>
            <Controller
              name="holderInfo.firstName"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập tên khách hàng"
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
      </>
    );
  }, [control, holderType]);

  const handleHolderSwitchPressed = useCallback(
    (value) => {
      if (value) {
        setValue("contactInfo.isHolder", false);
      } else {
        setValue("contactInfo", {
          lastName: holderInfo.lastName,
          firstName: holderInfo.firstName,
          phoneNumber: holderInfo.phoneNumber,
          province: holderInfo.province,
          district: holderInfo.district,
          address: holderInfo.address,
        });
        setValue("contactInfo.isHolder", true);
      }
    },
    [
      holderInfo.address,
      holderInfo.district,
      holderInfo.firstName,
      holderInfo.lastName,
      holderInfo.phoneNumber,
      holderInfo.province,
      setValue,
    ]
  );

  return (
    <ScrollView
      contentContainerStyle={[gStyles.basePage, { minHeight: height }]}
    >
      <Headline label="Thông tin người đứng hợp đồng" marginT-8 />
      <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        {renderDependHolderType()}

        <View row marginT-10 centerV>
          <InputLabel text="Điện thoại" required />
          <View flex-2>
            <Controller
              name="holderInfo.phoneNumber"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập số điện thoại"
                  keyboardType="numeric"
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Tỉnh/Thành phố" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            error={Boolean(errors.province)}
            label={holderProvince?.name}
            onPress={handleHolderProvincePicked}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Quận/Huyện" required />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={holderDistrict?.name}
            disabled={!holderProvince || !holderProvince?.id}
            error={Boolean(errors.district)}
            onPress={handleHolderDistrictPicked}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Địa chỉ" required />
          <View flex-2>
            <Controller
              name="holderInfo.address"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập địa chỉ"
                  value={value}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>

        {holderType !== CustomerTypes.corporate && (
          <>
            <View row marginT-10 centerV>
              <InputLabel text="CMT/CCCD" required />
              <View flex-2>
                <Controller
                  name="holderInfo.citizenIdentity"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder="Nhập CMT/CCCD"
                      keyboardType="numeric"
                      value={value}
                      error={error}
                      isError={Boolean(error)}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Nơi cấp" required />
              <View flex-2>
                <Controller
                  name="holderInfo.issuedPlace"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <TextInput
                      placeholder="Nhập nơi cấp"
                      value={value}
                      error={error}
                      isError={Boolean(error)}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>
            <View row marginT-10 centerV>
              <InputLabel text="Ngày cấp" required />
              <View flex-2>
                <Controller
                  defaultValue=""
                  name="holderInfo.issuedDate"
                  control={control}
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <DateTimePicker
                      mode="date"
                      value={toDate(value)}
                      maximumDate={new Date()}
                      dateFormat="DD/MM/YYYY"
                      onChange={onChange}
                      renderInput={({ value }) => (
                        <TextInput
                          placeholder="Nhập ngày cấp"
                          onChangeText={onChange}
                          value={value}
                          error={error}
                          isError={Boolean(error)}
                          trailingAccessory={
                            <Calendar
                              fill={Colors.textBlackHigh}
                              width={20}
                              height={20}
                            />
                          }
                        />
                      )}
                    />
                  )}
                />
              </View>
            </View>
          </>
        )}
      </View>
      <View
        paddingH-16
        paddingV-4
        marginT-16
        row
        spread
        centerV
        bg-primary50
        style={gStyles.borderT}
      >
        <Text subtitle1>Thông tin người liên hệ</Text>
        <Switch
          value={!isHolder}
          height={32}
          width={52}
          thumbSize={28}
          onValueChange={handleHolderSwitchPressed}
        />
      </View>
      <View bg-white padding-16 style={[gStyles.borderV, gStyles.shadow]}>
        <View row centerV>
          <InputLabel text="Họ và tên đệm" />
          <View flex-2>
            <Controller
              name="contactInfo.lastName"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập họ và tên đệm"
                  value={value}
                  disabled={isHolder}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row centerV marginT-10>
          <InputLabel text="Tên" />
          <View flex-2>
            <Controller
              name="contactInfo.firstName"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập tên"
                  value={value}
                  disabled={isHolder}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Điện thoại" />
          <View flex-2>
            <Controller
              name="contactInfo.phoneNumber"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập số điện thoại"
                  keyboardType="numeric"
                  value={value}
                  disabled={isHolder}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Tỉnh/Thành phố" />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={contactProvince?.name}
            disabled={isHolder}
            error={Boolean(errors.contactInfo?.province)}
            onPress={handleContactProvincePicked}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Quận/Huyện" />
          <SelectField
            flex-2
            placeholder="Chọn"
            label={contactDistrict?.name}
            error={Boolean(errors.contactInfo?.district)}
            disabled={isHolder || !contactProvince || !contactProvince?.id}
            onPress={handleContactDistrictPicked}
          />
        </View>
        <View row marginT-10 centerV>
          <InputLabel text="Địa chỉ chi tiết" />
          <View flex-2>
            <Controller
              name="contactInfo.address"
              control={control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextInput
                  placeholder="Nhập địa chỉ"
                  value={value}
                  disabled={isHolder}
                  error={error}
                  isError={Boolean(error)}
                  onChangeText={onChange}
                />
              )}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

RequestCustomerTab.propTypes = {
  form: PropTypes.shape({
    control: PropTypes.any,
    setValue: PropTypes.func,
    watch: PropTypes.func,
    formState: PropTypes.shape({
      errors: PropTypes.object,
    }),
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default RequestCustomerTab;
