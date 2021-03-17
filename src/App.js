import './App.css';
import {useState, useEffect} from 'react'

const URL = "http://localhost/shopping_listBE/";


function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [amount, setAmount] = useState('')
  const [editAmount, setEditAmount] = useState('');

  useEffect(() => {
    let status = 0;
    fetch(URL + 'retrieve.php')
    .then(res => {
      status = parseInt(res.status);
      return res.json()
    })
    .then(
      (res) => {
        if (status === 200) {
          setItems(res);
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
    )
  }, [])

  function save(e) {
    e.preventDefault();
    let status = 0;
    fetch(URL + 'add.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        description: item,
        amount: ' ' + amount
      })
    })
    .then(res=> {
      status = parseInt(res.status);
      return res.json();
    })
    .then(
      (res) => {
        if (status === 200) {
          setItems(items => [...items, res]);
          setItem('');
        } else {
          alert(res.error);
        }
      }, (error) => {
        alert(error);
      }
    )
  }

  function remove(id) {
    let status = 0;
    fetch(URL + 'delete.php', {
    method: 'POST',
    headers: {
    'Accept': 'application/json',
    'Content-type': 'application/json',
    },
    body: JSON.stringify({
    id: id
    })
    })
    .then(res => {
    status = parseInt(res.status);
    return res.json()
    })
    .then (
    (res) => {
    if (status === 200) {
    const newListWithoutRemoved = items.filter((item) => item.id !== id);
    setItems(newListWithoutRemoved);
    } else {
    alert(res.error);
    }
    }, (error) => {
    alert(error);
    }
    )
    } 

    function setEditedItem(item) {
      setEditItem(item);
      setEditDescription(item?.description);
      }
    function setEditedItem(item) {
      setEditItem(item);
      setEditAmount(item?.amount);
    }

      function update(e) {
        e.preventDefault();
        let status = 0;
        fetch(URL + 'update.php', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        },
        body: JSON.stringify({
        id: editItem.id,
        description: editDescription,
        amount: editAmount
        })
        })
        .then(res => {
        status = parseInt(res.status);
        return res.json();
        })
        .then(
        (res) => {
        if (status === 200) {
        items[(items.findIndex(item => item.id === editItem.id))].description = editDescription;
        setItems([...items]);
        setEditItem(null);
        setEditDescription('');
        items[(items.findIndex(item => item.id === editItem.id))].amount = editAmount;
        setItems([...items]);
        setEditItem(null);
        setEditAmount('');
        } else {
        alert(res.error);
        }
        }, (error) => {
          alert(error);
        }
        )
        }


  return (
    <div className="container">
      <h3>Shopping List</h3>
      <div>
        <form onSubmit={save}>
          <label>New Item</label>
          <input value={item} onChange={e => setItem(e.target.value)}/>
          <label>Amount</label>
          <input value={amount} onChange={e => setAmount(e.target.value)}/>
          <button>Save</button>
        </form>
      </div>

    <ol>
        {items.map(item => (
        <li key={item.id}>
        {editItem?.id !== item.id &&
        item.description
        }
        {editItem?.id !== item.id &&
        item.amount
        }
        {editItem?.id === item.id &&
        <form onSubmit={update}>
        <input value={editDescription} onChange={e => setEditDescription(e.target.value)} />
        <input value={editAmount} onChange={e => setEditAmount(e.target.value)} />
        <button>Save</button>
        <button type="button" onClick={() => setEditedItem(null)}>Cancel</button>
        </form>
        }
        <a className="delete" onClick={() => remove(item.id)} href="#">
        Delete
        </a>&nbsp;
        {editItem === null &&
        <a className="edit" onClick={() => setEditedItem(item)} href="#">
        Edit
        </a>
        }
        </li>
      ))}
    </ol>
    </div>
  )
}

export default App;