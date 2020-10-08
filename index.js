let fetchCategories = fetch('/solomon/categories.php').then(resp => resp.json()).then(json => {
    let ul = document.querySelector('nav ul');
    let categories = json.categories;
    categories.forEach(i => {
        let li = document.createElement('li');
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = i.id.toString();
        let label = document.createElement('label');
        label.for = i.id.toString();
        label.innerText = i.name + ' - ' + i['count(*)'];
        li.appendChild(checkbox);
        li.appendChild(label);
        ul.appendChild(li);
        checkbox.onclick = (ev) => {
            let categories = history.state.categories;
            if (ev.target.checked && !categories.includes(ev.target.id)){
                categories.push(ev.target.id);
            }
            if (!ev.target.checked && categories.includes(ev.target.id)){
                categories.splice(categories.indexOf(ev.target.id), 1);
            }
            history.replaceState(Object.assign(history.state, {categories: categories}), '')
            updatePage();
        };
    });
});

document.getElementById('sort').onchange = (ev) => {
    history.state.sort = ev.target.value;
    updatePage();
}


const updatePage = () => {
    let queryParams = `?categories=${history.state.categories.join()}&sort=${document.getElementById('sort').value}`;
    history.replaceState(history.state, '', queryParams);
    fetch(`/solomon/girls.php${queryParams}`)
        .then(resp => resp.json())
        .then(json => {
            let girls = json.girls;
            // console.log(girls);
            let products = document.createElement('div');
            products.className = 'products';
            girls.forEach(girl => {
                let product = document.createElement('div');
                products.appendChild(product);
                let img = document.createElement('img');
                img.src = `/solomon/images/girl-${girl.id}.jpeg`;
                product.appendChild(img);
                product.className = 'product';
                product.style.backgroundColor = 'rgb(206, 76, 145)';
                let table = document.createElement('table');
                table.className = 'table';
                product.appendChild(table);
                let tbody = document.createElement('tbody');
                table.appendChild(tbody);
                for (let parameter in girl) {
                    if (['id', 'category_id'].includes(parameter)) continue;
                    let tr = document.createElement('tr');

                    let td = document.createElement('td');
                    td.innerText = parameter;
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.innerText = girl[parameter];
                    tr.appendChild(td);

                    tbody.appendChild(tr);
                }
                let button = document.createElement('button');
                button.className = 'btn btn-primary add2cart';
                button.innerText = 'Buy';
                button.setAttribute("data-toggle", "modal");
                button.setAttribute("data-target", "#girl");
                button.addEventListener('click', () => {
                    document.getElementById('modalwindow').innerHTML = '';
                    document.getElementById('modalwindow').appendChild(product.cloneNode(true));
                });
                product.appendChild(button);
            });
            document.querySelector('main').innerHTML = '';
            document.querySelector('main').appendChild(products);
        });
}


const main = async () => {
    await fetchCategories;
    let state = {
        categories: [],
        sort: 'name'
    };
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('categories')) {
        state.categories = urlParams.get('categories').split(',').filter(el => el !== '');
        let checkBoxes = document.querySelector('nav ul');
        for (let checkBox of checkBoxes.children)
            if (state.categories.includes(checkBox.firstChild.id))
                checkBox.firstChild.checked = true;
    }
    if (['price', 'date', 'name'].includes(urlParams.get('sort'))) {
        state.sort = urlParams.get('sort');
        document.getElementById('sort').value = state.sort
    }
    history.replaceState(state, '');
    updatePage();
};

main();