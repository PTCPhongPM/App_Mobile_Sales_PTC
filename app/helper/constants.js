import {
  AssignmentTurnedIn,
  Ballot,
  DeliveryComplete,
  Description,
  Group,
  Inventory,
  LocalShipping,
  PersonBought,
  PersonCold,
  PersonPin,
  PersonRemove,
  SolidCheckedCircle,
  SolidDocumentCheckMark,
  SolidDocumentDismiss,
  SolidDraft,
  SolidPending,
  TestDrive,
} from "../configs/assets";

export const DefaultErrorMessage = "Có lỗi xảy ra, vui lòng thử lại";

export const CustomerTypes = {
  corporate: "corporate",
  personal: "personal",
};

export const Civilities = {
  mr: "Anh",
  mrs: "Chị",
};

export const Genders = {
  male: "Nam",
  female: "Nữ",
};

export const CustomerApproachSources = [
  "Google Ads",
  "Fanpage",
  "Online khác",
  "Khách showroom",
  "Hotline",
  "Khách hàng cũ",
  "KH từ BGD",
  "Nguồn khác",
  "KH từ sự kiện",
  "KH từ môi giới",
];

export const CustomerStates = {
  hot: "Hot",
  warm: "Warm",
  cold: "Cold",
};

export const ExpectedSigningDate = [
  "Trong ngày",
  "Trong vòng 10 ngày",
  "Trong vòng 10-20 ngày",
  "Trong vòng 20-30 ngày",
  "Trong vòng 1-2 tháng",
  "Trong vòng 2-3 tháng",
  "Nhiều hơn 3 tháng",
];

export const PaymentMethods = [
  "Trả thẳng",
  "Trả góp",
  "Thuê tài chính",
  "Trả chậm",
  "Ngân hàng",
];

export const CustomerRoles = [
  "Chủ sở hữu",
  "Người sử dụng xe",
  "Người liên hệ",
  "Người giới thiệu",
  "Khác",
];

export const Banks = [
  "MBB",
  "MSB",
  "NAMA",
  "NCB",
  "OCB",
  "PGBANK",
  "PVCOMBANK",
  "SCB",
  "SEABANK",
  "SGB",
];

export const CompanyTypes = [
  "Công ty tư nhân",
  "Đơn vị hành chính sự nghiệp",
  "Doanh nghiệp nước ngoài",
  "Doanh nghiệp nhà nước",
];

export const CustomerSortBy = {
  firstLetter: "Tên khách hàng",
  processIndex: "Quy trình",
  updatedDate: "Ngày cập nhật",
  createdDate: "Ngày tạo",
  source: "Nguồn",
};

export const TestDriveSortBy = {
  createdAt: "Ngày tạo",
  firstLetter: "Tên khách hàng",
};

export const DeliverySortBy = {
  createdAt: "Ngày tạo",
  firstLetter: "Tên khách hàng",
};

export const OrderBy = {
  asc: "Tăng dần",
  desc: "Giảm dần",
};

export const CustomerScopes = {
  mine: "Khách hàng của tôi",
  all: "Tất cả khách hàng",
};

export const SaleProcesses = {
  research: "Tìm hiểu",
  view: "Xem sản phẩm",
  test: "Lái thử",
  negotiation: "Thương thảo",
  contract: "Ký hợp đồng",
  finance: "Duyệt tài chính",
  payment: "Thanh toán",
  delivery: "Giao xe",
};

export const SaleProcessIndexes = {
  0: "research",
  1: "view",
  2: "test",
  3: "negotiation",
  4: "contract",
  5: "finance",
  6: "payment",
  7: "delivery",
};

export const ProcessesLastIndex = 7;

export const CustomerSources = [
  "Google Ads",
  "Fanpage",
  "Online khác",
  "Khách showroom",
  "Hotline",
  "Khách hàng cũ",
  "KH từ BGD",
  "Nguồn khác",
  "KH từ sự kiện",
  "KH từ môi giới",
];

export const LostCustomerReasons = {
  "Cá nhân": [
    "Thay đổi kế hoạch",
    "Vấn đề về Tài chính cá nhân",
    "Ngân hàng không phê duyệt",
    "KH mua xe cũ",
  ],
  "Mua xe hãng khác": [
    "Sản phẩm",
    "Giá & Khuyến mãi",
    "Địa Điểm",
    "Thời Điểm Giao Xe",
  ],
  "Mua xe đại lý khác": [
    "Giá & Khuyến mãi",
    "Địa Điểm",
    "Xe Sẵn Có",
    "Thời gian giao xe",
  ],
};

export const FrozenCustomerReasons = [
  "Không liên lạc được",
  "Thay đổi kế hoạch",
  "Không có nhu cầu",
  "Khác",
];

export const IntendedUses = ["Kinh doanh", "Sử dụng cá nhân", "Cho thuê"];

export const BuyingTypes = ["Mua lần đầu", "Mua thay thế", "Mua thêm"];

export const SaleActivities = {
  meet: "Gặp trực tiếp ĐL",
  outsideMeet: "Gặp trực tiếp ngoài ĐL",
  message: "Nhắn tin",
  call: "Gọi điện",
  email: "Email",
  other: "Khác",
};

export const ProductColorTypes = {
  exterior: "exterior",
  interior: "interior",
};

export const ActivityResults = [
  "Phân vân giá",
  "Phân vân tài chính",
  "Phân vân loại xe",
  "Phân vân hỏi ý kiến",
  "Đợi có xe",
  "Khác",
];

export const CarPurposes = [
  "Kinh doanh",
  "Gia đinh",
  "Kinh doanh và gia đình",
  "Cho thuê",
  "Khác",
];

export const YesNosEn = {
  true: "yes",
  false: "no",
};

export const YesNos = {
  yes: "Có",
  no: "Không",
};

export const MaritalStatus = {
  single: "Độc thân",
  married: "Có gia đình",
  other: "Khác",
};

export const TestDriveStates = {
  approved: "Đã duyệt",
  created: "Chờ duyệt",
  rejected: "Từ chối",
  draft: "Bản nháp",
  done: "Hoàn thành",
  incomplete: "Chưa hoàn thành",
};

export const TestDriveStateObject = {
  approved: "approved",
  created: "created",
  rejected: "rejected",
  draft: "draft",
  done: "done",
  incomplete: "incomplete",
};

export const RequestStates = {
  draft: "Bản nháp",
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  completed: "Hoàn thành",
};

export const RequestStateObject = {
  draft: "draft",
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  completed: "completed",
};

export const RequestStateIcons = {
  draft: SolidDraft,
  pending: SolidPending,
  approved: SolidDocumentCheckMark,
  rejected: SolidDocumentDismiss,
  completed: SolidCheckedCircle,
};

export const RequestStateIconColors = {
  draft: "neutral",
  pending: "orange",
  approved: "green",
  rejected: "red",
  completed: "green",
};

export const ContractStates = {
  draft: "Bản nháp",
  pending: "Chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
  completed: "Hoàn thành",
  cancelled: "Hủy hợp đồng",
};

export const ContractStateObject = {
  draft: "draft",
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  completed: "completed",
  cancelled: "cancelled",
};

export const ContractCancelStateObject = {
  pending: "pending",
  confirmed: "confirmed",
  unconfirmed: "unconfirmed",
};

export const ContractStateIcons = {
  draft: SolidDraft,
  pending: SolidPending,
  approved: SolidDocumentCheckMark,
  rejected: SolidDocumentDismiss,
  completed: SolidCheckedCircle,
  cancelled: SolidDocumentDismiss,
};
export const ContractStateIconColors = {
  draft: "neutral",
  pending: "orange",
  approved: "green",
  rejected: "red",
  completed: "green",
  cancelled: "neutral",
};

export const TestDrivePlaces = ["Tại đại lý", "Ngoài đại lý"];
export const DeliveryPlaces = ["Tại đại lý", "Ngoài đại lý"];

export const IncompleteTestDriveReasons = [
  "Xe lái thử không sẵn sàng",
  "Đường lái thử không sẵn sàng",
  "Khách hàng từ chối lái thử",
  "Khách hàng bận",
  "Lý do sức khỏe của TVBH",
  "Khách hàng đã từng sử dụng xe",
  "Khách hàng đã lái thử ở đại lý khác",
  "Khách hàng tin tưởng sản phẩm",
  "Khách hàng đã tìm hiểu qua bạn bè, người thân",
  "Khách hàng không phải người trực tiếp sử dụng xe",
  "Xe giao không sẵn sàng",
  "Khoang giao xe không sẵn sàng",
  "Khách hàng từ chối giao xe",
  "Khách hàng bận",
  "Lý do sức khỏe của TVBH",
  "Không đủ dặm",
  "Khách hàng bận",
  "Lý do bảo hiểm 1",
  "Lý do bảo hiểm 2",
  "Lý do bảo hiểm 3",
  "Lý do bảo hiểm 4",
  "Lý do tài chính 1",
  "Lý do tài chính 2",
  "Lý do tài chính 3",
  "Khác",
];

export const Formalities = {
  sell: "Bán",
  dlrPresent: "ĐLR tặng",
};

export const FormalityObj = {
  sell: "sell",
  dlrPresent: "dlrPresent",
};

export const ExtendedFormalities = {
  sell: "Bán",
  dlrPresent: "ĐLR tặng",
  brandPresent: "Hãng tặng",
};

export const ExtendedFormalityObj = {
  sell: "sell",
  dlrPresent: "dlrPresent",
  brandPresent: "brandPresent",
};

export const DiscountTypes = {
  number: "Số tiền",
  percentage: "Phần trăm",
};

export const DiscountTypeObject = {
  number: "number",
  percentage: "percentage",
};

export const InsuranceTypes = [
  "Vật chất",
  "Trách Nhiệm Dân Sự",
  "Người ngồi trên xe",
];

export const ProductRegistrationTypes = ["Khách hàng đăng ký", "DLR đăng ký"];

export const ContractSortBy = {
  createdAt: "Ngày tạo",
  firstLetter: "Tên hợp đồng",
};

export const CancelContractReasons = [
  "Nợ nhóm",
  "Không chứng minh được thu nhập",
  "Không cung cấp đủ hồ sơ",
  "Xe tăng giá",
  "Thay đổi thời gian giao xe",
  "Không thu xếp được tài chính",
  "Ý kiến khác",
];

export const ContractTypes = ["Bán lẻ", "Bán lô"];
export const ContractSigners = ["Giám đốc kinh doanh", "Giám đốc điều hành"];

export const RankObject = {
  deliveryRank: {
    rank: "deliveryRank",
    target: "deliveryTarget",
    quantity: "delivered",
  },
  signingRank: {
    target: "signingTarget",
    rank: "signingRank",
    quantity: "signed",
  },
};

export const DashboardMenuIcons = {
  "OthersStack/Approval": AssignmentTurnedIn,
  "OthersStack/Inventory": Inventory,
  "OthersStack/DeliverySchedule": LocalShipping,
  "OthersStack/TestDriveManagement": TestDrive,
  Contracts: Description,
  Customers: Group,
  "OthersStack/FromCompanyCustomers": PersonPin,
  AllocationProduct: DeliveryComplete,
  TaskManagement: Ballot,
  "OthersStack/FrozenCustomers": PersonCold,
  "OthersStack/LostCustomers": PersonRemove,
  "OthersStack/BoughtCustomers": PersonBought,
};

export const AllocationStates = ["allocated", "instock", "ready", "done"];

export const AllocationStateObject = {
  allocated: "Phân xe",
  instock: "Xe về kho",
  ready: "Sẵn sàng",
  done: "Hoàn tất giao",
};

export const DeliveryIncompleteReasons = [
  "Xe giao không sẵn sàng",
  "Khoang giao xe không sẵn sàng",
  "Khách hàng từ chối giao xe",
  "Khách hàng bận",
  "Lý do sức khỏe của TVBH",
  "Khác",
];

export const DeliveryStates = {
  draft: "Bản nháp",
  pending: "Chờ duyệt",
  rejected: "Từ chối",
  approved: "Đã duyệt",
};

export const DeliveryStateObject = {
  rejected: "rejected",
  draft: "draft",
  pending: "pending",
  approved: "approved",
};

export const DeliveryCompletionStates = {
  completed: "Hoàn thành",
  incompleted: "Không hoàn thành",
};

export const DeliveryConfirmationState = {
  unconfirmed: "Chưa hoàn thành", // Chưa xác nhận
  confirmed: "Xác nhận hoàn thành",
};
