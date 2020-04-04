for f in ls *.mp3; do ffmpeg -ac 1 -i $f $(basename $f).wav; done
