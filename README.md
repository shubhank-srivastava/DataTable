# Data Table Demo

This is demo for DataTable component in plain JS. API is given below -

```
const dt = new DataTable(document.getElementById("data-table"), {
   key: 'id',
   data: [], 
   columns: [
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
});
```
