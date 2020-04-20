## Benchmark server

### Chạy chương trình Benchmark

* Vào thư mục Benchmark .Ở trong thư mục hiện tại, có 3 file chạy của chương trình:

* Benchmark-linux : file để chạy trên linux

* Benchmark-macos: file để chạy trên macos

* Bechmark-win.exe: file để chạy trên windows

Tùy vào môi trường server ta sẽ chạy file tương ứng.

#### Đối với linux: 

Lệnh sẽ như sau

``` 
./Benchmark-linux argv[2] argv[3] argv[4] argv[5] argv[6] argv[7] argv[8]
```

Chú ý: các argument truyền vào là bắt buộc, phải truyền đủ 3 argument!

Trong đó: 

* argv[2]: tham số truyền vào thứ nhất tương ứng với chế độ benchmark trên cpu hay gpu

* argv[3]: tham số truyền vào thứ 2 tương ứng với đường dẫn tới ffmpeg

* argv[4]: tham số truyền vào thứ 3 tương ứng với file hoặc luồng udp đầu vào (input thread)

* argv[5]: tham số truyền vào thứ 4 tương ứng với bộ mã hóa (encoder) sử dụng là gì. Ví dụ: libx264, h264_nvenc.

* argv[6]: tham số  truyền vào thứ 5 tương ứng với preset transcode là gì.

* argv[7]: tham số  truyền vào thứ 6 tương ứng với luồng udp output là gì.

* argv[8]: tham số truyền vào thứ 7 sử dụng cho benchmark GPU tương ứng với việc lựa chọn card gpu nào để thực hiện benchmark

Ví dụ:

Đối với CPU:

``` 
./Benchmark-linux cpu ffmpeg input_1080.mp4 libx264 veryfast udp://224.0.0.1:7777
```

Đối với GPU:

* Trước hết tạo luồng udp để làm luồng đầu vào cho bechmark (vì benchmark trên gpu ffmpeg không có lệnh stream_loop). Vì vậy ta thực hiện lệnh sau sử dụng ffmpeg thường, ví dụ:

``` 
./ffmpeg -re -stream_loop -1 -i input_1080.mp4 -c copy -f mpegts udp://224.0.0.1:9999
```

##### Chú ý: sử dụng địa chỉ udp từ 224 trở lên mới có thể chia sẻ cho chương trình khác.

``` 
./Benchmark-linux gpu ffmpeg udp://224.0.0.1:9999 h264_nvenc ll udp://224.0.0.1:7777 3
```

-Kết quả sẽ hiện ra như sau:

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

* Sử dụng luồng 1080p để kiểm tra
* Tăng dần số process lên bắt đầu từ 1
* Cứ sau 30s thì thêm 1 process
* Và cứ sau 25s kể từ khi thêm một process thì kiểm tra độ ổn định của tất cả các process. Nếu bất kỳ process nào có speed < 0.97 thì sẽ lấy số process trước đó.Đồng thời dừng chương trình.

