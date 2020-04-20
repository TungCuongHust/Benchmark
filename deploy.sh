#!/bin/sh

get_distribution() {
    lsb_dist=""
    # Every system that we officially support has /etc/os-release
    if [ -r /etc/os-release ]; then
        lsb_dist="$(. /etc/os-release && echo "$ID")"
    fi
    echo "$lsb_dist"
}

# Perform some very rundimentary platform detection

lsb_dist=$(get_distribution)

echo $lsb_dist

if [[ "$lsb_dist" == "ubuntu" ]]; then
    #Setup ffmpeg
    apt update &&
        apt install ffmpeg &&
        apt install git &&
        git clone https://github.com/TungCuongHust/Benchmark.git &&
        cd Benchmark
    exit 0
else
    if [[ "$lsb_dist" == "centos" ]]; then
        if [[ "$(. /etc/os-release && echo "$VERSION_ID")" == "8" ]]; then
            #Setup ffmpeg for Centos 8
            yum install -y glibc-langpack-en &&
                yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm &&
                yum install https://download1.rpmfusion.org/free/el/rpmfusion-free-release-8.noarch.rpm https://download1.rpmfusion.org/nonfree/el/rpmfusion-nonfree-release-8.noarch.rpm &&
                yum install http://rpmfind.net/linux/epel/7/x86_64/Packages/s/SDL2-2.0.10-1.el7.x86_64.rpm &&
                yum install ffmpeg ffmpeg-devel &&
                yum install git &&
                git clone https://github.com/TungCuongHust/Benchmark.git &&
                cd Benchmark
            exit 0
        else
            #Setup ffmpeg for Centos 7
            yum install epel-release &&
                rpm -v --import http://li.nux.ro/download/nux/RPM-GPG-KEY-nux.ro &&
                rpm -Uvh http://li.nux.ro/download/nux/dextop/el7/x86_64/nux-dextop-release-0-5.el7.nux.noarch.rpm &&
                yum install ffmpeg ffmpeg-devel &&
                yum update &&
                yum install git &&
                git clone https://github.com/TungCuongHust/Benchmark.git &&
                cd Benchmark
            exit 0
        fi

    else
        if [[ "$lsb_dist" == "alpine" ]]; then
            #Setup ffmpeg
            apk add --update ffmpeg &&
                #Setup git
                apk add --update git &&
                git clone https://github.com/TungCuongHust/Benchmark.git &&
                cd Benchmark
            exit 0
        else
            if [[ "$lsb_dist" == "debian" ]]; then
                #Setup ffmpeg
                apt update &&
                    apt install ffmpeg &&
                    apt install git &&
                    git clone https://github.com/TungCuongHust/Benchmark.git &&
                    cd Benchmark
                exit 0
            else
                echo "The script failed"
                exit 1
            fi
        fi
    fi
fi
