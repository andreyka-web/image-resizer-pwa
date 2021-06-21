(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js', { scope: '.' })
                .then(registration => {
                    console.log('Service Worker is registered', registration);
                })
                .catch(err => {
                    console.error('Registration failed:', err);
                });
        });
    }

    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 200;
   // ctx.drawImage(img, 0,0, 100, 200);


    let inp = document.createElement('input');
    inp.type = 'file';
    inp.style.display = 'none';
    inp.addEventListener('change', (e)=>{
        createImageBitmap(inp.files[0]).then((bitmap)=> { 
            console.log(bitmap.width, bitmap.height);

            // save bitmap
        })
    });

    document.body.appendChild(inp);

    document.querySelector('#upload').addEventListener('click', (e) => {
        console.log('clicked');
        inp.click();
    });
})()