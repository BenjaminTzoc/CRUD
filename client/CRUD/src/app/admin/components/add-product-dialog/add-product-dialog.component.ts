import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.css']
})
export class AddProductDialogComponent {
  productForm!: FormGroup;
  showValidationErrors: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private productsService: ProductsService,
    private authService: AuthService,
    private toastr: ToastrService,
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  addProduct() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      this.productsService.addProduct(product).subscribe(
        response => {
          if (response.statusCode === 201) {
            this.toastr.success(response.message);
            this.dialogRef.close(true);
          }
          else if (response.statusCode === 403) {
            this.toastr.error(response.message);
            this.authService.logout();
            this.dialogRef.close(true);
          }
        },
        error => {
          this.toastr.error(`Error: ${error.error.message}`);
          console.error('Error al agregar el producto:', error);
        }
      );
    } else {
      this.showValidationErrors = true;
    }
  }

  close() {
    this.dialogRef.close();
  }

  getErrorMessage(field: string): string {
    if (field === 'name') {
      return this.productForm.get('name')?.hasError('required') ? 'El nombre es obligatorio' : '';
    } else if (field === 'price') {
      return this.productForm.get('price')?.hasError('required') ? 'El precio es obligatorio' : '';
    }
    return '';
  }
}
