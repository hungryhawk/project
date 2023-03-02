// находим элемент формы
const itemForm = document.getElementById('todo-form');
// находим элемент input
const itemInput = document.getElementById('title');
// находим элемент ul в dom
const itemList = document.getElementById('item-list');
// находим элемент кнопка удалииь все
const clearBtn = document.getElementById('clear');
// находим элемент инпут фильтр
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemToDom(item));
  checkUI();
}

// функция для добавления элемента
function onAddItemSubmit(e) {
  // отменяем привычное поведение браузера
  e.preventDefault();

  //   выносим в отдельную переменную значение в input
  const newItem = itemInput.value;

  // если в инпут ничего не введено, показывать alert
  if (newItem === '') {
    alert('Please add an item');
    return;
  }
  //   создаем отдельный li элемент
  // const li = document.createElement('li');
  // //   записать в элемент li информацию из input
  // li.appendChild(document.createTextNode(newItem));
  // //   создаем отдельный button элемент

  // const button = document.createElement('button');
  // button.className = 'remove-item';
  // //   создаем отдельный i элемент

  // const icon = document.createElement('i');
  // //   добавляем класс элементу i
  // icon.className = 'fa-solid fa-xmark';

  // //   добавить в баттон элемент icon
  // button.appendChild(icon);

  // //   добавить в элемент ли элемент баттон
  // li.appendChild(button);
  // //   ------------------
  // //   добавить в список элемент ли в конец
  // //   itemList.appendChild(li);
  // // ---------------------
  // //   добавить в список элемент ли в начало

  // const theFirstChild = itemList.firstChild;
  // itemList.insertBefore(li, theFirstChild);

  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists');
      return;
    }
  }

  // добавляем элемент в DOM
  addItemToDom(newItem);
  // добавляем элемент в local storage
  addItemToStorage(newItem);

  // функция которая проверяет наличие элементов в списке
  checkUI();

  //   очистить поле ввода после отправки формы
  itemInput.value = '';
}

function addItemToDom(item) {
  const li = document.createElement('li');
  //   записать в элемент li информацию из input
  li.appendChild(document.createTextNode(item));
  //   создаем отдельный button элемент

  const button = document.createElement('button');
  button.className = 'remove-item';
  //   создаем отдельный i элемент

  const icon = document.createElement('i');
  //   добавляем класс элементу i
  icon.className = 'fa-solid fa-xmark';

  //   добавить в баттон элемент icon
  button.appendChild(icon);

  //   добавить в элемент ли элемент баттон
  li.appendChild(button);
  //   ------------------
  //   добавить в список элемент ли в конец
  //   itemList.appendChild(li);
  // ---------------------
  //   добавить в список элемент ли в начало

  const theFirstChild = itemList.firstChild;
  itemList.insertBefore(li, theFirstChild);
}

function addItemToStorage(item) {
  // создаем переменную
  const itemsFromStorage = getItemsFromStorage();

  itemsFromStorage.push(item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  // создаем переменную
  let itemsFromStorage;
  // проверяем есть ли элементы в сторадже
  if (localStorage.getItem('items') === null) {
    // если нет, пустой массив
    itemsFromStorage = [];
  } else {
    // если есть, мы их парсим в массив и запсываем в переменную
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));
  // 1 способ
  item.classList.add('edit-mode');
  // 2 способ
  // item.style.color = '#ccc';
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228b22';
  itemInput.value = item.textContent;
}

// функция для удаления элементов по нажатию на крестик
function removeItem(item) {
  if (confirm('Are you sure?')) {
    // remove item from dom
    item.remove();

    // remeove item from storage
    removeItemFromStorage(item.textContent);

    checkUI();
  }
}

function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();

  // filter out to be removed
  itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

  // re-set to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// функция для удаления сразу всех элементов 1 способ
// function clearItems() {
//   itemList.innerHTML = '';
// }

// функция для удаления сразу всех элементов 2 способ
function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // clear from loaclstorage
  localStorage.removeItem('items');

  // функция которая проверяет наличие элементов в списке
  checkUI();
}

function filterItems(e) {
  // найти все элементы ли
  const items = itemList.querySelectorAll('li');

  // получить значение из input и привести к нижнему регистру
  const text = e.target.value.toLowerCase();
  // перебираем массив
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();
    // 1 способ
    // if (itemName.indexOf(text) != -1) {
    //   item.style.display = 'flex';
    // } else {
    //   item.style.display = 'none';
    // }
    // 2 способ
    if (itemName.includes(text)) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function checkUI() {
  itemInput.value = '';
  // найти все лементы ли внутри списка
  const items = itemList.querySelectorAll('li');
  // если в массиве 0 элемннтов, мы не показываем кнопку очистить все + фильтр
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>  Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);

  checkUI();
}

init();

// localStorage.setItem('name', 'Brad');
