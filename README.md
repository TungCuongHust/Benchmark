- Cài đặt môi trường chạy code benchmark trên bất kỳ server nào:

``` 
source deploy.sh
```

##### Note: Các option trong quá trình cài đặt chọn yes

* Kết quả sẽ hiện ra như sau:

``` 
Number_threads_1080p_veryfast=1
Result_capacity_unit_superfast=45
Result_capacity_unit_veryfast=40
Result_capacity_unit_medium=13
```

* Chú thích: 

| Giá trị                              | Ý nghĩa                |
| -------------                        |:-------------:         |      
| Number_threads_1080p_veryfast        | Số  thread 1080p tối đa mà máy có thể chạy được với preset là veryfast                   |
| Result_capacity_unit_superfast       | Số đơn vị của máy với preset là superfast                 | 
| Result_capacity_unit_veryfast        | Số đơn vị của máy với preset là veryfast                 |
| Result_capacity_unit_medium          | Số đợn vị của máy với preset là medium                |    

#### Luật kiểm tra năng lực:

- Sử dụng luồng 1080p để kiểm tra
- Tăng dần số process lên bắt đầu từ 1
- Cứ sau 30 thì thêm 1 process
- Và cứ sau 25s kể từ khi thêm một process thì kiểm tra độ ổn định của tất cả các process. Nếu bất kỳ process nào có speed < 0.97 thì sẽ lấy số process trước đó. Đồng thời dừng chương trình.
