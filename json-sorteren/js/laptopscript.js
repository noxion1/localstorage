let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        sorteerLaptopsObject.data = JSON.parse(this.responseText);
        sorteerLaptopsObject.addJSdate();

        sorteerLaptopsObject.data.forEach(laptop => {
            laptop.naamUpper = laptop.naam.toUpperCase();

            laptop.sortAuthor = laptop.merk[0];
        });
        sorteerLaptopsObject.sort();
    }
}
xmlhttp.open('GET', "boeken.json", true);
xmlhttp.send();


const createTableHead = (arr) => {
    let head = "<table class='geselecteerdeLaptops'><tr>";
    arr.forEach((item) => {
        head += "<th>" + item + "</th>";
    });
    head += "</tr>";
    return head;
}

const giveMonthNumber = (month) => {
    let number;
    switch (month) {
        case "januari":
            number = 0;
            break;
        case "februari":
            number = 1;
            break;
        case "maart":
            number = 2;
            break;
        case "april":
            number = 3;
            break;
        case "mei":
            number = 4;
            break;
        case "juni":
            number = 5;
            break;
        case "juli":
            number = 6;
            break;
        case "augustus":
            number = 7;
            break;
        case "september":
            number = 8;
            break;
        case "oktober":
            number = 9;
            break;
        case "november":
            number = 10;
            break;
        case "december":
            number = 11;
            break;
        default:
            number = 0;
    }
    return number;
}

const changeJSdate = (monthYear) => {
    let myArray = monthYear.split(" ");
    let date = new Date(myArray[1], giveMonthNumber(myArray[0]));
    return date;
}

const maakOpsomming = (array) => {
    let string = "";
    for (let i = 0; i < array.length; i++) {
        switch (i) {
            case array.length - 1:
                string += array[i];
                break;
            case array.length - 2:
                string += array[i] + " en ";
                break;
            default:
                string += array[i] + " , ";
        }
    }
    return string;
}

const reverseText = (string) => {
    if (string.indexOf(',') != -1) {
        let array = string.split(',');
        string = array[1] + ' ' + array[0];
    }

    return string;
}

let shoppingcart = {
    items: [],

    getItems: function () {
        let purchase;
        if (localStorage.getItem('GekochtenLaptops') == null) {
            purchase = [];
        } else {
            purchase = JSON.parse(localStorage.getItem('GekochtenLaptops'));
            purchase.forEach(item => {
                this.items.push(item);
            })
            this.uitvoeren();
        }
        return purchase;
    },

    add: function (el) {
        this.items = this.getItems();
        this.items.push(el);
        localStorage.setItem('GekochtenLaptops', JSON.stringify(this.items));
        this.uitvoeren();
    },

    uitvoeren: function () {
        if (this.items.length > 0) {
            document.querySelector('.shoppingcart__quantity').innerHTML = this.items.length;
        } else {
            document.querySelector('.shoppingcart__quantity').innerHTML = "";
        }
    }
}

shoppingcart.getItems();

let sorteerLaptopsObject = {
    data: "",

    kenmerk: "naamUpper",

    oplopend: 1,

    addJSdate: function () {
        this.data.forEach((item) => {
            item.jsDatum = changeJSdate(item.processor);
        });
    },

    sort: function () {
        this.data.sort((a, b) => a[this.kenmerk] > b[this.kenmerk] ? 1 * this.oplopend : -1 * this.oplopend);
        this.uitvoeren(this.data);
    },

    uitvoeren: function (data) {
        document.getElementById('uitvoer').innerHTML = "";

        data.forEach(laptop => {
            let section = document.createElement('section');
            section.className = 'geselecteerdeLaptops';

            let main = document.createElement('main');
            main.className = 'geselecteerdeLaptops__main';

            let image = document.createElement('img');
            image.className = 'geselecteerdeLaptops__cover';
            image.setAttribute('src', laptop.cover);
            image.setAttribute('alt', reverseText(laptop.naam));

            let title = document.createElement('h3');
            title.className = 'geselecteerdeLaptops__title';
            title.textContent = reverseText(laptop.naam);

            let authors = document.createElement('p');
            authors.className = 'geselecteerdeLaptops__authors';
            laptop.merk[0] = reverseText(laptop.merk[0]);
            authors.textContent = maakOpsomming(laptop.merk);

            let extra = document.createElement('p');
            extra.className = 'geselecteerdeLaptops__extra';
            extra.textContent = laptop.processor + ' | graphiccard ' + laptop.graphiccard + ' | geheugen ' + laptop.ram + ' | opslag: ' + laptop.opslag;

            let price = document.createElement('div');
            price.className = 'geselecteerdeLaptops__price';
            price.textContent = laptop.prijs.toLocaleString('nl-NL', {
                currency: 'EUR',
                style: 'currency'
            });

            let priceButton = document.createElement('button');
            priceButton.className = 'geselecteerdeLaptops__priceButton';
            priceButton.innerHTML = 'add to<br>shoppingcart';
            priceButton.addEventListener('click', () => {
                shoppingcart.add(laptop);
            })

            section.appendChild(image);
            main.appendChild(title);
            main.appendChild(authors);
            main.appendChild(extra);
            section.appendChild(main);
            price.appendChild(priceButton);
            section.appendChild(price);
            document.getElementById('uitvoer').appendChild(section);
        });

    }
}

document.getElementById('kenmerk').addEventListener('change', (e) => {
    sorteerLaptopsObject.kenmerk = e.target.value;
    sorteerLaptopsObject.sort();
});

document.getElementsByName('oplopend').forEach((item) => {
    item.addEventListener('click', (e) => {
        sorteerLaptopsObject.oplopend = parseInt(e.target.value);
        sorteerLaptopsObject.sort();
    });
});
