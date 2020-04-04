for filename in *.mp3.wav; do
    [ -f "$filename" ] || continue
    mv "$filename" "${filename//.mp3/}"

done
