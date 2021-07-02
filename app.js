(function () {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js', { scope: './' })
                .then(registration => {
                    console.log('Service Worker is registered', registration);
                })
                .catch(err => {
                    console.error('Registration failed:', err);
                });
        });
    }

    let table = document.getElementsByTagName('tbody')[0];
    let row = document.getElementById('table-row');
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let inp = document.createElement('input');

    inp.type = 'file';
    inp.style.display = 'none';
    inp.addEventListener('change', (e) => {
        if (inp.files.length === 0) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        Array.from(inp.files).forEach((file, i) => {
            let crow = row.cloneNode(true);
            crow.removeAttribute('id');
            table.appendChild(crow);
            let image = crow.querySelectorAll('img')[0]
            let jpgBtn = crow.querySelector('a[name="jpg"]');
            let quality = crow.querySelector('input[name="q"]');
            let size = crow.querySelector('input[name="s"]');

            let [w, h] = [0, 0];
            createImageBitmap(file).then((bitmap) => {
                w = bitmap.width;
                h = bitmap.height;

                image.width = w >= h ? 120 : 120 * w / h;
                image.height = h >= w ? 120 : 120 * h / w;

                document.querySelector('#resized-list').appendChild(canvas);

                image.onload = async () => await writesize(true);
                image.src = URL.createObjectURL(file);
            })

            quality.addEventListener('input', (e) => quality.closest('p').querySelector('span').innerHTML = e.target.value);
            quality.addEventListener('change', (e) => writesize());
            size.addEventListener('input', (e) => setsize(e.target.value));
            size.addEventListener('change', (e) => writesize(true));

            let q = () => parseFloat((quality.value * 0.01).toFixed(2));
            let setsize = (v) => {
                size.closest('p').querySelector('span').innerHTML = `${Math.round(v * w / 100)}x${Math.round(v * h / 100)}`;
                canvas.width = Math.round(v * w / 100);
                canvas.height = Math.round(v * h / 100);
            }
            let writesize = (d = false) => {
                if (d) {
                    setsize(size.value);
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                }
                jpgBtn.href = canvas.toDataURL('image/jpeg', q());
                jpgBtn.download = `${Date.now()}-${canvas.width}x${canvas.height}-${quality.value}.jpg`;
                canvas.toBlob((blob) => crow.querySelector('i[name="jpg-size"]').innerHTML = `~ ${(blob.size / 1024).toFixed(1)} kb`, 'image/jpeg', q());
                console.log(`writesize`);
            }
        });
    });

    document.body.appendChild(inp);
    document.querySelector('#upload').addEventListener('click', (e) => inp.click());
    document.querySelector('#upload').addEventListener('dragover', (e) => e.preventDefault());
    document.querySelector('#upload').addEventListener('drop', (e) => {
        console.log(`files dropped`);
        e.preventDefault();
        if (e.dataTransfer.items) {
            // for (let i = 0; i < e.dataTransfer.items.length; i++) {
            //     if (e.dataTransfer.items[i].kind === 'file') {
            //         let file = e.dataTransfer.items[i].getAsFile();
                    inp.files = e.dataTransfer.files;
                    // console.log(e.dataTransfer);

                    // vanilla JS
                    let event = document.createEvent("UIEvents");
                    event.initUIEvent("change", true, true);
                    inp.dispatchEvent(event);

                    // console.log(file);
            //     }
            // }
        } else {
            console.log(e.dataTransfer.items);
        }
    });
})()