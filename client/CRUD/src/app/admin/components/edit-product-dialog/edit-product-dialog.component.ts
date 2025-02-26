import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProductsService } from 'src/app/core/services/products.service';

@Component({
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.component.html',
  styleUrls: ['./edit-product-dialog.component.css']
})
export class EditProductDialogComponent {
  productForm!: FormGroup;
  showValidationErrors: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditProductDialogComponent>,
    private productsService: ProductsService,
    private authService: AuthService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productForm = this.fb.group({
      name: [data.name || ''],
      price: [data.price || ''],
      status: [data.status]
    });
  }

  updateProduct() {
    if (this.productForm.valid) {
      const product = this.productForm.value;
      this.productsService.updateProduct(this.data.id, product).subscribe(
        response => {
          if (response.statusCode === 200){
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
          console.error('Error al actualizar el producto:', error);
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
