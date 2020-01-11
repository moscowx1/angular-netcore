import { Product } from "./product.model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class Repository {

  productData: Product;

  constructor(private http: HttpClient) {
    this.getProduct(1);
  }

  getProduct(id: number) {
    this.http.get<Product>("/api/products/" + id)
      .subscribe(p => {
        this.productData = p;
        console.log("Product Data Received");
      });
  }

  get product(): Product {
    console.log("Product Data Requested");
    return this.productData;
  }
}
