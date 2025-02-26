import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductsService } from 'src/app/core/services/products.service';
import { AddProductDialogComponent } from '../components/add-product-dialog/add-product-dialog.component';
import { EditProductDialogComponent } from '../components/edit-product-dialog/edit-product-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  displayedColumns: string[] = ['name', 'price', 'status', 'username', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  products: any[] = [];
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productsService: ProductsService, 
    private authService: AuthService, 
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getProducts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getProducts() {
    this.productsService.getProducts().subscribe(
      response => {
        if (response.statusCode === 200) {
          this.dataSource = new MatTableDataSource(response.products);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        }
        else if (response.statusCode === 403) {
          this.authService.logout();
        }
      },
      error => {
        console.error("Error al obtener los productos: ", error);
      }
    );
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProducts();
      }
    });
  }

  editProduct(product: any) {
    const dialogRef = this.dialog.open(EditProductDialogComponent, { data: product });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getProducts();
      }
    });
  }

  deleteProduct(product: any) {
    this.productsService.deleteProduct(product.id).subscribe(
      response => {
        console.log(response);
        if (response.statusCode === 200) {
          console.log("Producto eliminado: ", response);
          this.getProducts();
        }
        else if (response.statusCode === 403) {
          this.authService.logout();
        }
      },
      error => {
        console.error('Error al eliminar el producto:', error);
      }
    )
  }
}
