// src/App.js
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TableComponent from './components/UI-Table';
import './App.css'; 

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <TableComponent />
      </div>
    </DndProvider>
  );
}

export default App;
