let studentArray = [];
let operationArray = [];
let toggleState = false;
let isHidden = true;

document.getElementById('addButton').onclick = function () {
    let sName = prompt("Give student name");
    let sClassName = prompt("Give student's class name");
    if (sName && sClassName) {
        let rollNo = Date.now();
        studentArray.push({ rollNo, sName, sClassName });
        createElements(rollNo, sName, sClassName);
    }
};

document.getElementById('evenButton').onclick = function () {
    toggleState = toggleState ? false : true;
    if (toggleState) {
        // for (i = 0; i < studentArray['length']; i++) {
        //     if (i % 2 != 0) {
        //         let x = document.getElementById((`student${studentArray[i].rollNo}`))
        //         x.setAttribute('class', 'evenColor')
        //     }
        // }
        tableBody.classList.add('alternate-rows');
    }
    else {
        // for (i = 0; i < studentArray['length']; i++) {
        //     if (i % 2 != 0) {
        //         let x = document.getElementById((`student${studentArray[i].rollNo}`))
        //         x.removeAttribute('class', 'evenColor')
        //     }
        // }
        tableBody.classList.remove('alternate-rows')
    }

}

document.getElementById('editButton').onclick = function () {
    if (operationArray.length === 0) {
        return alert('No students are selected');
    } else if (operationArray.length !== 1) {
        return alert('Multiple students cannot be selected at once.');
    } else {
        const rollNo = operationArray[0];
        const student = studentArray.find(s => s.rollNo === rollNo);
        if (student) {
            let x = document.getElementById('forDisplay');
            x.textContent = JSON.stringify(student);
        } else {
            alert('Student not found');
        }
    }
};


const deleteFunc = () => {
    if (operationArray.length === 0) {
        return alert('Select at least one element to delete');
    }
    operationArray.forEach(rollNo => {
        const el = document.getElementById(`student${rollNo}`);
        if (el) {
            el.remove();
        }
    });
    studentArray = studentArray.filter(student => !operationArray.includes(student.rollNo));
    alert('Deletion successful');
    operationArray = [];
    document.getElementById('all').checked = false;
};

function updateTable() {
    let globalChkbox = document.getElementById('all')
    globalChkbox.checked = false;
    document.getElementById('tableBody').innerHTML = '';
    studentArray.forEach(student => {
        createElements(student.rollNo, student.sName, student.sClassName);
    });
}

function deleteAction(id) {
    const x = document.getElementById(`student${id}`);
    x.style.background = '#FFCCCB';
    operationArray.push(id);
}

function edit(id) {
    const x = document.getElementById('forDisplay')
    const getData = studentArray.find((elem) => elem.rollNo === id)
    console.log(getData)
    x.textContent = JSON.stringify(getData)
}

function duplicate(id) {
    const originalStudent = studentArray.find(student => student.rollNo === id);
    if (!originalStudent) return;
    const newStudent = {
        rollNo: Date.now(),
        sName: originalStudent.sName,
        sClassName: originalStudent.sClassName
    };
    const index = studentArray.findIndex(student => student.rollNo === id);
    studentArray.splice(index + 1, 0, newStudent);

    updateTable();
}


function createElements(rollNo, studentName, sClassName) {
    const boldText = document.createElement("b");
    const wholeRow = document.createElement('tr');
    wholeRow.setAttribute('id', `student${rollNo}`);

    const tableR1 = document.createElement('td');
    const chkBox = document.createElement('input');
    chkBox.setAttribute('type', 'checkbox');
    chkBox.setAttribute('id', `id${rollNo}`);

    chkBox.addEventListener('change', (event) => {
        if (event.target.checked) {
            operationArray.push(rollNo);
        } else {
            operationArray = operationArray.filter(id => id !== rollNo);
        }
    });

    wholeRow.appendChild(tableR1).appendChild(chkBox);

    const tableR2 = document.createElement('td');
    tableR2.textContent = studentName;
    boldText.appendChild(tableR2);
    wholeRow.appendChild(boldText);

    const tableR3 = document.createElement('td');
    tableR3.textContent = rollNo;
    wholeRow.appendChild(tableR3);

    const tableR4 = document.createElement('td');
    tableR4.textContent = sClassName;
    wholeRow.appendChild(tableR4);

    const buttonsTD = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = 'btn btn-warning btn-sm';
    editBtn.setAttribute('onclick', `edit(${rollNo})`);
    editBtn.setAttribute('class', 'p-2 bg-purple-400 rounded mx-2')
    buttonsTD.appendChild(editBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.setAttribute('onclick', `deleteAction(${rollNo})`);
    deleteBtn.setAttribute('class', 'p-2 bg-red-400 rounded  mx-2')
    buttonsTD.appendChild(deleteBtn);

    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'View';
    viewBtn.setAttribute('onclick', `view(${rollNo})`);
    viewBtn.setAttribute('class', 'p-2 bg-purple-400 rounded  mx-2')
    buttonsTD.appendChild(viewBtn);

    const duplicateButton = document.createElement('button')
    duplicateButton.textContent = 'Duplicate';
    duplicateButton.setAttribute('onclick', `duplicate(${rollNo})`);
    duplicateButton.setAttribute('class', 'p-2 bg-purple-400 rounded  mx-2')
    buttonsTD.appendChild(duplicateButton);

    wholeRow.appendChild(buttonsTD);
    document.getElementById('tableBody').appendChild(wholeRow);
}

const checkbox = document.getElementById('all');
checkbox.addEventListener('change', (event) => {
    operationArray = [];
    studentArray.forEach(student => {
        document.getElementById(`id${student.rollNo}`).checked = event.target.checked;
        if (event.target.checked) {
            operationArray.push(student.rollNo);
        }
    });
});

let txtar = document.getElementById('inputTextArea');
const maxLength = parseInt(txtar.attributes.maxLength.nodeValue);

txtar.addEventListener('input', () => {
    textarSpan.removeAttribute('hidden')
    textarSpan.textContent = txtar.value.length
    if (txtar.value.length === 0) textarSpan.setAttribute('hidden', 'true')
});

selectOptionAdd.onclick = function () {
    let optionElem = document.createElement('option')
    optionElem.textContent = optionsForSelect.value
    optionElem.setAttribute('value', `${optionsForSelect.value}`)
    selectTask.appendChild(optionElem)
    disableOption(optionsForSelect.value)
    optionsForSelect.value = ''
    selectTask.removeAttribute('hidden')
}

function disableOption(enabledOption) {
    let allOptions = selectTask.querySelectorAll('option')
    allOptions.forEach(opt => {
        if (opt.value !== enabledOption) {
            opt.disabled = true
        }
        else opt.selected = true
    });
}

document.getElementById('countButton').onclick = function () {
    if (isHidden) {
        containerForCount.hidden = false;
        containerForCount.innerHTML = `Total rows are ${tableBody.querySelectorAll('tr').length} & total columns are ${tableBody.querySelectorAll('td').length}`
    }
    else {
        containerForCount.hidden = true;
    }
    isHidden = !isHidden;
}