const notify = [
{
    value: "muc-bat-buoc",
    type: "error",
    notify: "Mục bắt buộc không được để trống."
},
{
    value: "ten-ton-tai",    
    type: "error",
    notify: "Tên chuyên mục đã tồn tại."
},
{
    value: "duong-dan-ton-tai",
    type: "error",
    notify: "Đường dẫn tĩnh đã tồn tại."
},
{
    value: "them-thanh-cong",
    type: "success",
    notify: "Thêm chuyên mục thành công."
},
{
    value: "chinh-sua-thanh-cong",
    type: "success",
    notify: "Chỉnh sửa chuyên mục thành công."
},
{
    value: "khong-kich-hoat",
    type: "error",
    notify: "Lỗi không có chuyên mục để kích hoạt."
},
{
    value: "ten-kich-hoat-ton-tai",
    type: "error",
    notify: "Tên chuyên mục cần kích hoạt đã tồn tại."
},
{
    value: "khong-co-cha",
    type: "error",
    notify: "Chuyên mục con không có chuyên mục cha."
},
{
    value: "duong-dan-kich-hoat-ton-tai",
    type: "error",
    notify: "Đường dẫn tĩnh của chuyên mục kích hoạt đã tồn tại."
},
{
    value: "khong-co-quan-ly",
    type: "error",
    notify: "Chưa có người quản lý chuyên mục đó."
}
];

module.exports = {
    notify
}