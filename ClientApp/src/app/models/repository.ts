import { Product } from "./product.model";
import { Supplier } from "./supplier.model";

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Filter } from "./configClasses.repository";

const productsUrl = "/api/products";
const suppliersUrl = "/api/suppliers";

@Injectable()
export class Repository {

  product: Product;
  products: Product[];
  suppliers: Supplier[] = [];
  filter: Filter = new Filter();


  constructor(private http: HttpClient) {
    //this.filter.category = "soccer";
    this.filter.related = true;

    this.getProducts(true);
  }

  getProduct(id: number) {
    this.http.get<Product>(`${productsUrl}/${id}`)
      .subscribe(p => this.product = p);
  }

  getProducts(related = false) {
    let url = `${productsUrl}?related=${this.filter.related}`;

    if (this.filter.category) {
      url += `&category=${this.filter.category}`;
    }

    if (this.filter.search) {
      url += `&search=${this.filter.search}`;
    }

    this.http.get<Product[]>(url)
      .subscribe(prods => this.products = prods);
  }

  getSuppliers() {
    this.http.get<Supplier[]>(suppliersUrl)
      .subscribe(s => this.suppliers = s);
  }

  createProduct(p: Product) {
    let data = {
      name: p.name, category: p.category,
      description: p.description, price: p.price,
      supplier: p.supplier ? p.supplier.supplierId : 0
    };

    this.http.post<number>(productsUrl, data)
      .subscribe(id => {
        p.productId = id;
        this.products.push(p);
      });
  }

  createProductAndSupplier(p: Product, s: Supplier) {
    let data = {
      name: s.name, city: s.city, state: s.state
    };


    this.http.post<number>(suppliersUrl, data)
      .subscribe(id => {
        s.supplierId = id;
        p.supplier = s;
        console.log(s);
        this.suppliers.push(s);
        if (p != null) {
          this.createProduct(p);
        }
      });
  }

  replaceProduct(prod: Product) {
    let data = {
      name: prod.name, category: prod.category,
      description: prod.description, price: prod.price,
      supplier: prod.supplier ? prod.supplier.supplierId : 0
    };

    this.http.put(`${productsUrl}/${prod.productId}`, data)
      .subscribe(() => this.getProducts());
  }

  replaceSupplier(supp: Supplier) {
    let data = {
      name: supp.name, city: supp.city, state: supp.state
    };

    this.http.put(`${suppliersUrl}/${supp.supplierId}`, data)
      .subscribe(() => this.getProducts());
  }

  updateProduct(id: number, changes: Map<string, any>) {
    let patch = [];
    changes.forEach((value, key) =>
      patch.push({ op: "replace", path: key, value: value }));

    this.http.patch(`${productsUrl}/${id}`, patch)
      .subscribe(() => this.getProducts());
  }
}
