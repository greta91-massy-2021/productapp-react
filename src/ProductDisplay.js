import { logDOM } from '@testing-library/react';
import React from 'react';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';

export default class ProductDisplay extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      networkError: false,
      startEditing : false,
      product : {},
      // productId: 1000,
      products : [
        // {
        //   id: 1,
        //   name: "Souris",
        //   category: "Informatique",
        //   price: 12.99
        // },
        // {
        //   id: 2,
        //   name: "Clavier",
        //   category: "Informatique",
        //   price: 14.99
        // },
        // {
        //   id: 3,
        //   name: "Ecran",
        //   category: "Informatique",
        //   price: 99.99
        // }
      ]
    }
  }
  
  //productId = 2
  //tabRes = []
  // iteration 1
  //product = {id:1, ...}
  //condition = true
  //tabRes = [{id:1, ...}]
  // iteration 2
  //product = {id:2, ...}
  //condition = false
  //tabRes = [{id:1, ...}]
  // iteration 3
  //product = {id:3, ...}
  //condition = true
  //tabRes = [{id:1, ...}, {id:3, ...}]
  deleteProduct = (productId)=>{//productId = 2 => products=[1,3]
    fetch(`http://localhost:3500/api/products/${productId}`, {
      method: "DELETE"
    })
    .then((data)=>data.json())
    .then((res)=>this.setState(
            {products : 
              this.state.products.filter((product)=> product.id !== productId)}
            ))
  }

  showForm = (product)=>{
    this.setState({startEditing: true, product: product});
  }
  cancel = ()=>{
    this.setState({startEditing: false, product: {}});
  }
  save = (product)=>{
    //ajout d'un nouveau produit
    if (!product.id) {
      // product.id = this.state.productId;
      fetch("http://localhost:3500/api/products", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(product)
      })
      .then((data)=>data.json())
      .then((res)=>{
        this.setState({products: this.state.products.concat(res), 
                          // productId : this.state.productId+1, 
                          startEditing: false})
        console.log(res)
      })
    }
    else{
      fetch(`http://localhost:3500/api/products/${product.id}`, {
        method: "PUT",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify(product)
      })
      .then((data)=>data.json())
      .then((res)=> this.setState(
        {
          products: this.state.products.map((p)=> p.id === product.id ? res : p), 
          startEditing: false
        }
        ))
      
    }
  }
  render(){
    if (this.state.networkError) {
      return <p>problème de réseau !</p>
    } else {
      return this.state.startEditing ? 
            <ProductForm product={this.state.product} 
                        cancelCallback={this.cancel} 
                        saveCallback={this.save}/> : 
            <ProductTable products={this.state.products} 
                          showForm={this.showForm} 
                          deleteCallback={this.deleteProduct}/>
    }
  }
  componentDidMount = ()=>{
    let promesse= fetch("http://localhost:3500/api/products");
    promesse
    .then((data)=>{
      console.log(data);
      return data.json()
    })
    .then((res)=> {
      console.log(res);
      this.setState({products: res})
    })
    .catch((err)=>{
      console.log(err)
      this.setState({networkError: true})
    })
  }
}