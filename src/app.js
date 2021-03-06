import React from 'react';
import firebase from './firebase';
import {TodoDetails} from './todoDetails';
import {TodoList} from './todoList';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state          = {
            items      : [],
            text       : '',
            currentItem: {
                text  : 'Todo Name',
                id    : 'ID',
                status: 'Initial'
            }
        };
        this.handleChange   = this.handleChange.bind(this);
        this.handleSubmit   = this.handleSubmit.bind(this);
        this.loadToDoDetail = this.loadToDoDetail.bind(this);
    }

    handleChange(e) {
        this.setState({text: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.state.text.length) {
            return;
        } else {
            const itemsRef = firebase.database().ref('items').child(Date.now());
            const newItem  = {
                id    : Date.now(),
                text  : this.state.text,
                status: 'Initial'
            };
            itemsRef.set(newItem);
            this.setState({text: ''});
        }
    }

    loadToDoDetail(currentID) {
        let selectedItem = this.state.currentItem;
        this.state.items.forEach(function (current) {
            if (current.id == currentID) {
                selectedItem = current;
            }
        });

        this.setState({
            currentItem: selectedItem
        });
    }

    componentDidMount() {
        const itemsRef = firebase.database().ref('items');
        itemsRef.on('value', snapshot => {
            let items    = snapshot.val();
            let newState = [];
            for (let item in items) {
                newState.push({
                    id    : items[item].id,
                    text  : items[item].text,
                    status: items[item].status
                });
            }
            this.setState({
                items: newState
            });
        });
    }

    render() {
        return (
            <div className="todoListMain row">
                <div className="header col-12 col-lg-1 text-center p-3">
                    <h1>
                        <a href="./"><i className="fab fa-react" /></a>React Todo List
                    </h1>
                </div>
                <div className="add col-12 col-md-5 p-3 bg-light">
                    <div className="form-wrap p-3 shadow-sm">
                        <h2>Add Your Todos</h2>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Enter new task here..." id="new-todo" value={this.state.text} onChange={this.handleChange} />
                            </div>
                            <button type="submit" className="btn btn-dark">
                                Add Task #{this.state.items.length + 1}
                            </button>
                        </form>
                    </div>
                    <div className="list-wrap mt-3 p-3 shadow-sm">
                        <h2>Your Todo List</h2>
                        <TodoList items={this.state.items} onChange={this.loadToDoDetail} />
                    </div>
                </div>
                <div className="list col-12 col-md-6 p-3">
                    <TodoDetails currentItem={this.state.currentItem} />
                </div>
            </div>
        );
    }
}
