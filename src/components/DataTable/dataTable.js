/**
 * This component renders a Data Table. API is given below -
 * {
 *  key: 'id',
 *  data: [], 
 *  columns: [
      {
        title: 'Name',
        dataIndex: 'name',
        searchable: true,
        sortable: true,
        sortByType: "string" 
      },
    ],
    pageSizes: [10, 20, 30],
    rowActions: [
      {
        title: "View",
        onclick: (evt) => {}
      }
    ]
 */
import "./dataTable.css";
import { getISODate } from "../../utils/date";
import { loader, search } from "./icons";
import sortElement from "./sortIcon";

class DataTable {
  constructor(domNode, config) {
    if (!domNode)
      throw new Error("Specify an HTML element as first parameter.");
    if (!config)
      throw new Error("Specify the config for data-table as second parameter.");
    if (!config.columns) throw new Error("Columns are undefined in config.");
    if (!config.key) throw new Error("'key' is undefined in config.");
    if (config.columns.filter((c) => c.dataIndex === config.key).length === 0)
      throw new Error("'key' is not a dataIndex in any columns.");
    if (config.pageSizes !== undefined && !Array.isArray(config.pageSizes))
      throw new Error("'pageSizes' should be of type Array.");
    if (config.rowActions !== undefined && !Array.isArray(config.rowActions))
      throw new Error("'rowActions' should be of type Array.");
    this.domNode = domNode;
    this.domNode.classList.add("dt");
    this.config = {
      key: "",
      data: [],
      columns: [],
      pageSizes: [10],
      rowActions: [],
      ...config
    };
    this.dataView = this.config.data;
    this.page = 0;
    this.table = null;
    this.thead = null;
    this.tbody = null;
    this.pagination = null;
    this.actionPopup = null;
    this.searchFilters = new Map();
    this.loader = document.createElement("div");
    this.loader.innerHTML = loader;
    this.loader.style.display = "none";
    this.domNode.appendChild(this.loader);
  }

  setLoading(flag) {
    if (flag) {
      this.loader.style.display = "block";
    } else {
      this.loader.style.display = "none";
    }
  }

  setData(data) {
    this.config.data = data;
    this.dataView = data;
  }

  createSearch(th, dataIndex) {
    let searchImg = document.createElement("div");
    searchImg.innerHTML = search;
    searchImg.className = "searchable";
    searchImg.addEventListener(
      "click",
      this.openSearchBox.bind(this, th, dataIndex)
    );
    return searchImg;
  }

  createTableHeader() {
    let thead = document.createElement("thead");
    let tr = document.createElement("tr");
    for (let col of this.config.columns) {
      let th = document.createElement("th");
      let headDiv = document.createElement("div");
      headDiv.className = "th-flex";
      let thText = document.createTextNode(col.title);
      let titleDiv = document.createElement("div");
      titleDiv.style.flexGrow = 8;
      titleDiv.appendChild(thText);
      headDiv.appendChild(titleDiv);
      if (col.searchable) {
        let searchIcon = this.createSearch(th, col.dataIndex);
        headDiv.appendChild(searchIcon);
      }
      if (col.sortable) {
        let sortEl = sortElement();
        headDiv.appendChild(sortEl);
        headDiv.style.cursor = "pointer";
        headDiv.addEventListener("click", this.sortRow.bind(this, col, sortEl));
      }
      th.appendChild(headDiv);
      tr.appendChild(th);
    }
    if (this.config.rowActions.length > 0) {
      let th = document.createElement("th");
      tr.appendChild(th);
    }
    thead.appendChild(tr);
    if (this.thead === null) {
      this.thead = thead;
      this.table.appendChild(this.thead);
    } else {
      this.table.replaceChild(thead, this.thead);
      this.thead = thead;
    }
  }

  createTableBody() {
    let tbody = document.createElement("tbody");
    let start = this.page * parseInt(this.selectedPageSize.value, 10);
    let end = start + parseInt(this.selectedPageSize.value, 10);
    let filteredRows = this.dataView;
    if (this.searchFilters.size > 0) {
      for (let [key, val] of this.searchFilters) {
        filteredRows = filteredRows.filter((v) =>
          new RegExp(val, "ig").test(v[key].toString())
        );
      }
    }
    for (let row of filteredRows.slice(start, end)) {
      let tr = document.createElement("tr");
      for (let col of this.config.columns) {
        let td = document.createElement("td");
        let tdText = document.createTextNode(row[col.dataIndex]);
        td.appendChild(tdText);
        tr.appendChild(td);
      }
      if (this.config.rowActions.length > 0) {
        tr = this.addRowActions(tr, row);
      }
      this.config.key && tr.setAttribute("key", row[this.config.key]);
      tbody.appendChild(tr);
    }
    this.createPages(filteredRows.length);
    if (this.tbody === null) {
      this.tbody = tbody;
      this.table.appendChild(this.tbody);
    } else {
      this.table.replaceChild(tbody, this.tbody);
      this.tbody = tbody;
    }
  }

  addRowActions(tr, row) {
    let td = document.createElement("td");
    let img = document.createElement("img");
    img.src =
      "https://cdn0.iconfinder.com/data/icons/user-interface-255/100/more-512.png";
    img.style.width = "25px";
    img.style.cursor = "pointer";
    img.addEventListener("click", (evt) => {
      evt.stopPropagation();
      this.showActionPopup(evt.target.x, evt.target.y, row);
    });
    td.appendChild(img);
    tr.appendChild(td);
    return tr;
  }

  showActionPopup(x, y, row) {
    this.actionPopup !== null && this.actionPopup.remove();
    let ul = document.createElement("ul");
    ul.className = "context-menu";
    ul.style.top = `${y + 2}px`;
    ul.style.left = `${x + 10}px`;
    for (let action of this.config.rowActions) {
      let li = document.createElement("li");
      li.appendChild(document.createTextNode(action.title));
      li.addEventListener("click", action.onClick.bind(this, row));
      ul.appendChild(li);
    }
    this.actionPopup = ul;
    document.body.appendChild(this.actionPopup);
    const close = (e) => {
      if (this.actionPopup) {
        document.body.removeChild(this.actionPopup);
        document.body.removeEventListener("click", close);
        this.actionPopup = null;
      }
    };
    document.body.addEventListener("click", close);
  }

  openSearchBox(el, dataIndex, evt) {
    evt.stopPropagation();
    if (el.querySelector("[search-box=true]") !== null) return;
    let input = document.createElement("input");
    let srchbtn = document.createElement("button");
    let searchPopup = document.createElement("div");
    searchPopup.setAttribute("search-box", true);
    searchPopup.addEventListener("click", (e) => e.stopPropagation());
    srchbtn.appendChild(document.createTextNode("Search"));
    srchbtn.className = "btn btn-light btn-small";
    srchbtn.addEventListener(
      "click",
      this.searchRow.bind(this, dataIndex, input)
    );
    let cancelBtn = document.createElement("button");
    cancelBtn.className = "btn btn-light btn-small";
    cancelBtn.appendChild(document.createTextNode("Cancel"));
    cancelBtn.addEventListener("click", () => {
      this.searchRow(dataIndex, null);
      el.removeChild(searchPopup);
    });
    searchPopup.appendChild(input);
    searchPopup.appendChild(srchbtn);
    searchPopup.appendChild(cancelBtn);
    el.appendChild(searchPopup);
  }

  searchRow(dataIndex, inputEl) {
    if (inputEl === null || !inputEl.value) {
      if (this.searchFilters.has(dataIndex)) {
        this.searchFilters.delete(dataIndex);
        this.createTableBody();
      }
    } else {
      this.searchFilters.set(dataIndex, inputEl.value);
      this.createTableBody();
    }
  }

  sortRow(col, sortEl) {
    this.config.columns.forEach((c) => {
      if (c.dataIndex !== col.dataIndex) {
        c.sortOrder = null;
      } else if (!c.sortOrder || c.sortOrder === "asc") {
        if (!c.sortOrder) {
          c.sortOrder = "asc";
          sortEl.lastChild.opacity = 0.5;
          sortEl.firstChild.opacity = 1;
        } else if (c.sortOrder === "asc") {
          c.sortOrder = "desc";
          sortEl.lastChild.opacity = 1;
          sortEl.firstChild.opacity = 0.5;
        }
        this.dataView = this.sortByType(this.config.data, c);
      } else if (c.sortOrder === "desc") {
        c.sortOrder = null;
        this.dataView = this.config.data;
        sortEl.lastChild.opacity = 1;
        sortEl.firstChild.opacity = 1;
      }
    });
    // this.createTableHeader();
    this.createTableBody();
  }

  sortByType(arr, col) {
    let data = [...arr];
    switch (col.sortByType) {
      case "number":
        data.sort((a, b) => {
          return parseFloat(a[col.dataIndex]) - parseFloat(b[col.dataIndex]);
        });
        break;
      case "date":
        data.sort((a, b) => {
          return (
            new Date(getISODate(a[col.dataIndex])) -
            new Date(getISODate(b[col.dataIndex]))
          );
        });
        break;
      default:
        data.sort((a, b) => {
          if (a[col.dataIndex] < b[col.dataIndex]) return -1;
          else if (a[col.dataIndex] > b[col.dataIndex]) return 1;
          return 0;
        });
    }
    return col.sortOrder === "asc" ? data : data.reverse();
  }

  createPagination() {
    let pagination = document.createElement("div");
    pagination.className = "pagination";
    let dropdown = document.createElement("select");
    for (let size of this.config.pageSizes) {
      let opt = document.createElement("option");
      opt.value = size;
      opt.appendChild(document.createTextNode(size + " / Page"));
      dropdown.appendChild(opt);
    }
    this.selectedPageSize = dropdown;
    pagination.appendChild(dropdown);
    this.pagination = pagination;
    dropdown.addEventListener("change", () => {
      this.page = 0;
      this.createTableBody();
    });
    this.createPages();
  }

  createPages(_totalPages) {
    let pagesDiv = document.createElement("div");
    if (this.page > 0) {
      let span = document.createElement("span");
      span.appendChild(document.createTextNode("Prev"));
      span.setAttribute("page", this.page - 1);
      pagesDiv.appendChild(span);
    }
    let _tp = _totalPages || this.dataView.length;
    let totalPages = Math.ceil(_tp / parseInt(this.selectedPageSize.value, 10));
    let i = this.page;
    let count = 0;
    while (i < totalPages && count < 5) {
      let span = document.createElement("span");
      span.appendChild(document.createTextNode(i + 1));
      span.setAttribute("page", i);
      if (i === this.page) span.setAttribute("selected", true);
      pagesDiv.appendChild(span);
      count++;
      i++;
    }
    if (this.page + 1 < totalPages) {
      let span = document.createElement("span");
      span.appendChild(document.createTextNode("Next"));
      span.setAttribute("page", this.page + 1);
      pagesDiv.appendChild(span);
    }
    pagesDiv.addEventListener("click", this.goToPage.bind(this));
    if (!this.pagesDiv) {
      this.pagination.appendChild(pagesDiv);
      this.pagesDiv = pagesDiv;
    } else {
      this.pagination.replaceChild(pagesDiv, this.pagesDiv);
      this.pagesDiv = pagesDiv;
    }
  }

  goToPage(evt) {
    let page = evt.target.getAttribute("page");
    if (page) {
      this.page = parseInt(page, 10);
      this.createTableBody();
    }
  }

  render() {
    if (this.table) {
      this.createTableBody();
    } else {
      let tableDiv = document.createElement("div");
      tableDiv.className = "table";
      this.table = document.createElement("table");
      this.createPagination();
      this.createTableHeader();
      this.createTableBody();
      tableDiv.appendChild(this.table);
      this.domNode.appendChild(tableDiv);
      this.domNode.appendChild(this.pagination);
      tableDiv.addEventListener("scroll", this.tableScroll.bind(this));
    }
  }

  tableScroll(e) {
    let self = this;
    requestAnimationFrame(() => {
      self.thead.style.transform = `translateY(${e.target.scrollTop}px)`;
    });
  }

  renderRow(key) {
    let row = this.config.data.find((r) => r[this.config.key] === key);
    let tr = this.tbody.querySelector(`tr[key="${key}"]`);
    let td = tr.querySelectorAll("td");
    let columns = Array.from(td).slice(0, this.config.columns.length);
    let i = 0;
    for (let col of columns) {
      col.textContent = row[this.config.columns[i].dataIndex];
      i++;
    }
    if (this.config.rowActions.length > 0) {
      tr.removeChild(td[i]);
      tr = this.addRowActions(tr, row);
    }
  }
}

export default DataTable;
