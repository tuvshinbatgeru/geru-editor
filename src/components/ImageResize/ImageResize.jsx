import React from 'react'
import { Image } from 'gestalt'
import { S3_CLOUD_FRONT, S3_RESIZE_ENDPOINT } from '~/services/S3'

const ImageResize = (props) => {
    const { url, height, width, resize_width = 400 } = props
    let prefix = url.split(S3_CLOUD_FRONT)
    let key = prefix.length > 1 ? prefix[1] : ""

    const ratio = height / width
    const is_svg = url.includes('svg')

    if(is_svg)
    return (
        <Image 
            src={url}
            naturalHeight={1}
            naturalWidth={1}
        />
    )

    const json = {
        "bucket": "geru-mn",
        "key": key,
        "edits": {
          "resize": {
            "width": resize_width,
            "height": resize_width,// Math.ceil(resize_width * ratio),
            "fit": "cover"
          },
          "smartCrop": {}
        }
    }

    const str = JSON.stringify(json);
    const enc = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }));

    const src = S3_RESIZE_ENDPOINT + enc

    return (
        <Image 
            src={src}
            naturalHeight={1}
            naturalWidth={1}
        />
    )
}

export default ImageResize