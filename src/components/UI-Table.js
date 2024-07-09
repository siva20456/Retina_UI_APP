
import React, { useState } from 'react';
import { Button, Container, Row, Col, Table as BootstrapTable, Card, Modal, Form } from 'react-bootstrap';
import { useDrag, useDrop } from 'react-dnd';
import { ImBin } from "react-icons/im";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineProduct } from "react-icons/ai";
import { CgMenuGridO } from "react-icons/cg";
import { MdNumbers } from "react-icons/md";
import randomColor from 'randomcolor';
import './Table.css';

const ITEM_TYPE = 'ROW';

const DraggableRow = ({ id, index, moveRow, children }) => {
  const [, ref] = useDrag({
    type: ITEM_TYPE,
    item: { id, index },
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveRow(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <tr ref={(node) => ref(drop(node))}>
      {children}
    </tr>
  );
};

const TableComponent = () => {
  const [rows, setRows] = useState([
    { filter: "Discount % is 0", variants: ["Single image product", "Double image product","High"] },
    { filter: "tags contains onsale", variants: ["Multi Image - On Sale", "4 Images - On Sale"] },
    { filter: "trend sale live", variants: ["Trending" ,'Classic' ] },
  ]);
  const [currVal, setVal] = useState(3)
  const [showModal, setShowModal] = useState(false)
  const [currentRow, setCurrentRow] = useState(null);
  const [currentCol, setCurrentCol] = useState(null);
  const [designName, setDesignName] = useState('');

  const [columns, setColumns] = useState(["Primary Variant", "Variant 2",]);

  const addRow = () => setRows([...rows, { filter: "", variants: [] }]);
  const deleteRow = (index) => setRows(rows.filter((_, i) => i !== index));

  const addColumn = () => {
    setColumns([...columns, `Variant ${currVal}`])
    setVal(currVal + 1)
  }
  const deleteColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index))
    let newRows = rows.map(e => {
      e.variants = e.variants.filter((_, i) => i != index)
      return e
    })
    setRows(newRows)
  }

  const moveRow = (fromIndex, toIndex) => {
    const updatedRows = [...rows];
    const [movedRow] = updatedRows.splice(fromIndex, 1);
    updatedRows.splice(toIndex, 0, movedRow);
    setRows(updatedRows);
  };

  const handleAddDesign = (rowIndex, colIndex) => {
    // const newRows = [...rows];
    // newRows[rowIndex].variants[colIndex] = "New Design";
    // setRows(newRows);
    setCurrentCol(colIndex)
    setCurrentRow(rowIndex)
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSaveDesign = (e) => {
    e.preventDefault()
    if (designName != '') {
      const newRows = [...rows];
      if (currentCol === -1) {
        newRows[currentRow].filter = designName // Adding Filters if Column = -1
      } else {
        newRows[currentRow].variants[currentCol] = designName; // Adding Variants if Column != -1
      }
      setRows(newRows);
      setShowModal(false)
      setDesignName('')
    } else {
      alert('Enter Design/Filters ..!')
    }
  }

  return (
    <Container>
      <Row className="mt-3">
        <Col>
          <h1 className='text-primary'>Rules</h1>
        </Col>
      </Row>
      <div className="table-container mt-5">
        <div className='table-fixed'>
          <BootstrapTable bordered>
            <thead>
              <tr>
                <th style={{ backgroundColor: 'aliceblue', padding: 12 }}>S.NO<Button style={{ backgroundColor: 'transparent', color: 'black', border: 'none' }} className=' pb-2 pt-2' size="sm" ><MdNumbers /></Button></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <DraggableRow key={rowIndex} id={rowIndex} index={rowIndex} moveRow={moveRow} style={{ cursor: 'pointer' }}>
                  <td>
                    <Card>
                      <Card.Body style={{ backgroundColor: 'aliceblue' }}>
                        <a style={{ textDecoration: 'none' }} className='fs-5'>{rowIndex + 1}</a>
                        <CgMenuGridO style={{ backgroundColor: 'transparent', color: 'black', border: 'none', cursor: 'pointer' }} className='fs-3 mb-1' />
                      </Card.Body>
                    </Card>
                  </td>
                </DraggableRow>
              ))}
            </tbody>
          </BootstrapTable>
        </div>
        <div className='table-fixed'>
          <BootstrapTable bordered>
            <thead>
              <tr>
                <th style={{ backgroundColor: 'aliceblue', padding: 11 }}>Product Filter <Button style={{ backgroundColor: 'transparent', color: 'black', border: 'none' }} className='mb-2' size="sm" ><AiOutlineProduct /></Button></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <DraggableRow key={rowIndex} id={rowIndex} index={rowIndex} moveRow={moveRow} style={{ cursor: 'pointer' }}>
                  <td>
                    <Card>
                      <Card.Body style={{ backgroundColor: 'white' }}>
                        {row.filter !== "" ?
                          row.filter.split(" ").map((word, index) => (
                            <span key={index} style={{ color: randomColor({luminosity:'dark',hue:'random'}), margin: '0 2px ' }}>
                              {word}
                            </span>
                          ))
                          : <Button style={{ backgroundColor: 'transparent', color: 'black', }} size="sm" onClick={() => {
                            handleAddDesign(rowIndex, -1)
                          }}>Add Filter <IoMdAdd /></Button>}
                        <Button style={{ backgroundColor: 'transparent', color: 'black', border: 'none' }} className='mb-1' size="sm" onClick={() => deleteRow(rowIndex)}><ImBin color='red' /></Button>

                      </Card.Body>
                    </Card>
                  </td>
                </DraggableRow>
              ))}
            </tbody>
          </BootstrapTable>
        </div>
        <div className="table-scrollable">
          <BootstrapTable bordered>
            <thead>
              <tr>
                {columns.map((column, colIndex) => (
                  <th key={colIndex} style={{ backgroundColor: 'aliceblue' }}>
                    {column}
                    <Button style={{ backgroundColor: 'transparent', border: 'none' }} className={`mb-2 ${currVal > 3 && 'pb-2 mb-0'}`} size="sm" onClick={() => deleteColumn(colIndex)}><ImBin color='red' /></Button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <DraggableRow key={rowIndex} id={rowIndex} index={rowIndex} moveRow={moveRow} style={{ cursor: 'pointer' }}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>
                      <Card>
                        <Card.Body style={{ backgroundColor: 'aliceblue' }}>
                          {row.variants[colIndex] || <Button style={{ backgroundColor: 'transparent', color: 'black', }}  size="sm" onClick={() => {
                            handleAddDesign(rowIndex, colIndex)
                          }}><IoMdAdd /> Add Design</Button>}
                        </Card.Body>
                      </Card>
                    </td>
                  ))}
                  <td>
                    <Button variant="secondary" onClick={addColumn}>Add Variant</Button>
                  </td>
                </DraggableRow>
              ))}
            </tbody>
          </BootstrapTable>
        </div>
      </div>
      <Row className="mt-3 mb-3">
        <Col>
          <a className='add-btn' onClick={addRow}><IoMdAdd /></a>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleModalClose}  onSubmit={handleSaveDesign} >
        <Modal.Header closeButton>
          <Modal.Title>{currentCol == -1 ? 'Add Filters' : 'Add Design'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="designName">
              <Form.Label>{currentCol == -1 ? 'Filter Names' : 'Design Name'}</Form.Label>
              <Form.Control
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                placeholder={currentCol == -1 ? "Enter Filters with Space" : "Enter design name"}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Close</Button>
          <Button variant="primary" type='submit' onClick={handleSaveDesign}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TableComponent;
