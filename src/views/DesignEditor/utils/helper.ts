
import axios from 'axios'
import { backgroundRemovedImageUpload, fileUpload } from './services';
export function nFormatter(num, digits = 2) {
	const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var item = lookup.slice().reverse().find(function(item) {
	    return num >= item.value;
	});
	return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export function currencyFormat(price) {
	if(!price) return '0₮'
	return `${nFormatter(price)}₮`
}

export function AreaOfRectangle(rect, rect2) {
	//var d0 = divs.eq(0).position()
	//var d1 = divs.eq(1).position()
	var d1x = rect.left
	var d1y = rect.top

	var d1xMax = rect.left + rect.width
	var d1yMax = rect.top + rect.height

	var d2x = rect2.left
	var d2y = rect2.top

	var d2xMax = rect2.left + rect2.width
	var d2yMax = rect2.top + rect2.height

	var x_overlap = Math.max(0, Math.min(d1xMax, d2xMax) - Math.max(d1x, d2x))
	var y_overlap = Math.max(0, Math.min(d1yMax, d2yMax) - Math.max(d1y, d2y))

	return x_overlap * y_overlap
}

export function resizeImage(base64Str, maxWidth = 760, maxHeight = 760) {
	return new Promise((resolve) => {
	  let img = new Image()
	  img.src = base64Str
	  img.onload = () => {
		let canvas = document.createElement('canvas')
		const MAX_WIDTH = maxWidth
		const MAX_HEIGHT = maxHeight
		let width = img.width
		let height = img.height
  
		if (width > height) {
		  if (width > MAX_WIDTH) {
			height *= MAX_WIDTH / width
			width = MAX_WIDTH
		  }
		} else {
		  if (height > MAX_HEIGHT) {
			width *= MAX_HEIGHT / height
			height = MAX_HEIGHT
		  }
		}
		canvas.width = width
		canvas.height = height
		let ctx = canvas.getContext('2d')
		ctx.drawImage(img, 0, 0, width, height)
		resolve(canvas.toDataURL())
	  }
	})
}

export const getBase64 = async (url, user_id) => {
    return new Promise((resolve) => {
        const secure_url = url.replace('http://','https://')
        axios.get(secure_url, { responseType: 'arraybuffer' })
        .then(async response => {
            let inputBlob = new Blob(
                [response.data], 
                { type: response.headers['content-type'] }
            )
            const formData = new FormData();
            formData.append("image_file", inputBlob);
            const response_last = await fetch("https://sdk.photoroom.com/v1/segment", {
                method: "POST",
                headers: {
                  "x-api-key": "cc8e37280821c7c6fe6deba8513dec7d82d25d7a"
                //  "x-api-key": "9af797072c9d69c31918e747fc92af97a77dcae6"
                },
                body: formData
              });
            const outputBlob = await response_last.blob();
            const updatedFile = new File([outputBlob], "removed.png")
            backgroundRemovedImageUpload(updatedFile, async function(err, result) {
                if(err || !result) {
                    return
                }
                await fileUpload(user_id, result)
                const new_options = {
                    type: 'StaticImage',
                    metadata: { src: result.url },
                }
                resolve(new_options)
            })
        })
    }
)}
export const getImageDimensions = (url: string): Promise<{width: number, height: number}> => {
	return new Promise((resolve, reject) => {
	  const img = new Image();
	  img.onload = () => resolve({
		width: img.width,
		height: img.height,
	  });
	  img.onerror = (error) => reject(error);
	  img.src = url;
	});
};
