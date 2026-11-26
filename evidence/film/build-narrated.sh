#!/bin/bash
# Narrated film: chapter cards + real app recordings + voiceover segments (evidence/film/vo).
set -e
cd "$(dirname "$0")/build"
rm -f S_*.mp4 v_*.mp4 l_*.txt c[0-9]_*.mp4 p[0-9].mp4
V=$(ls ../../live-test/run3/video/*.webm); W=$(ls wp/*.webm); R=$(ls report/*.webm); N=$(ls ndjson/*.webm); VO=../vo
F="-r 30 -c:v libx264 -pix_fmt yuv420p -crf 20 -preset veryfast"
dur(){ ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }
cardv(){ ffmpeg -loglevel error -y -ss 0.25 -i $(ls ../cards-raw/$1/*.webm) -vf "scale=1440:900,fps=30,tpad=stop_mode=clone:stop_duration=60" -t $2 $F -an c$1_$2.mp4; echo c$1_$2.mp4; }
phonev(){ out=$1 bg=$2 src=$3 ss=$4 to=$5 len=$6 crop=$7; span=$(python3 -c "print($to-$ss)"); f=$(python3 -c "print($span/$len)")
 cr=""; [ "$crop" = 1 ] && cr="crop=430:736:0:0,"
 ffmpeg -loglevel error -y -loop 1 -t $len -i bg-$bg.png -ss $ss -to $to -i "$src" -filter_complex "[1:v]setpts=(PTS-STARTPTS)/$f,${cr}scale=502:860,fps=30,tpad=stop_mode=clone:stop_duration=60[v];[0:v][v]overlay=469:19[o]" -map "[o]" -t $len $F -an $out; }
seg(){ name=$1; a=$2; shift 2; printf "file '%s'\n" "$@" > l_$name.txt; ffmpeg -loglevel error -y -f concat -safe 0 -i l_$name.txt -c copy v_$name.mp4
 d=$(dur v_$name.mp4); ffmpeg -loglevel error -y -i v_$name.mp4 -i $a -filter_complex "[1:a]adelay=400|400,apad=whole_dur=$d[a]" -map 0:v -map "[a]" -t $d -c:v copy -c:a aac -b:a 160k -ar 44100 S_$name.mp4; echo "$name $d"; }
L(){ python3 -c "print(round($(dur $VO/$1.mp3)+1.2,2))"; }
L1=$(L s1); seg s1 $VO/s1.mp3 $(cardv 0 $L1)
L2=$(L s2); seg s2 $VO/s2.mp3 $(cardv 1 $L2)
L3=$(L s3); phonev p3.mp4 A "$V" 0 $L3 $L3 1; seg s3 $VO/s3.mp3 p3.mp4
L4=$(L s4); c=$(cardv 2 3); phonev p4.mp4 B "$V" 16 299 $(python3 -c "print($L4-3)") 1; seg s4 $VO/s4.mp3 $c p4.mp4
L5=$(L s5); c=$(cardv 3 3); phonev p5.mp4 C "$R" 0.5 $(dur $R) $(python3 -c "print($L5-3)") 0; seg s5 $VO/s5.mp3 $c p5.mp4
L6=$(L s6); c=$(cardv 4 3); phonev p6.mp4 D "$V" 306 434.3 $(python3 -c "print($L6-3)") 1; seg s6 $VO/s6.mp3 $c p6.mp4
L7=$(L s7); c=$(cardv 5 3); phonev p7.mp4 W "$W" 0.3 $(dur $W) $(python3 -c "print($L7-3)") 1; seg s7 $VO/s7.mp3 $c p7.mp4
L9=$(L s9); phonev p9.mp4 P "$N" 0.3 $(python3 -c "print(min($(dur $N),$L9+0.3))") $L9 0; seg s9 $VO/s9.mp3 p9.mp4
L10=$(L s10); seg s10 $VO/s10.mp3 $(cardv 2 $L10)
L8=$(L s8); seg s8 $VO/s8.mp3 $(cardv 6 $L8)
for s in s1 s2 s3 s4 s5 s6 s7 s9 s10 s8; do echo "file 'S_$s.mp4'"; done > final.txt
ffmpeg -loglevel error -y -f concat -safe 0 -i final.txt -c copy ../clause-film-narrated.mp4
echo total $(dur ../clause-film-narrated.mp4)
