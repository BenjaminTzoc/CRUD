import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserModel } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomvalidationService } from 'src/app/core/services/customValidation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('passwordInput') passwordInput: ElementRef | any;
  @ViewChild('passwordInput_confirm') passwordInput_confirm: ElementRef | any;
  eyeClass: string = 'bi-eye-fill';
  isShowing: boolean = false;
  showValidationErrors: boolean = false;
  msgErrorS: string = '';

  formRegister = new FormGroup({
    username: new FormControl('',[Validators.required,Validators.maxLength(20)]),
    email: new FormControl('',[Validators.required,Validators.pattern(this.customValidator.emailValidation()),Validators.maxLength(50)]),
    password: new FormControl('',[Validators.required,Validators.minLength(8),Validators.maxLength(20)]),
    passwordConfirm: new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(20)]),
  });

  userModel: UserModel | any = {} as UserModel;

  constructor(private readonly authService: AuthService, private customValidator:CustomvalidationService) { }

  register(){
    if (this.formRegister.value.passwordConfirm != '' && 
      this.formRegister.value.password != this.formRegister.value.passwordConfirm)
    {
      this.msgErrorS = "Las contraseñas no coinciden";
      return;
    } else
      this.msgErrorS = "";

    if (this.formRegister.valid) {
      this.userModel.username = this.formRegister.value.username;
      this.userModel.email = this.formRegister.value.email;
      this.userModel.password = this.formRegister.value.password;

      this.authService.register(this.userModel).subscribe(receivedItem => {
        console.log(receivedItem);
      },(error) => {
        if(error.error.email!=undefined){

        }
      });
      this.showValidationErrors = false;
    }else
      this.showValidationErrors = true;
  }

  showPass() {
    if (this.isShowing) {
      this.passwordInput.nativeElement.type = 'password';
      this.passwordInput_confirm.nativeElement.type = 'password';
      this.eyeClass = 'bi-eye-fill';
      this.isShowing = false;
    } else {
      this.passwordInput.nativeElement.type = 'text';
      this.passwordInput_confirm.nativeElement.type = 'text';
      this.eyeClass = 'bi-eye-slash-fill';
      this.isShowing = true;
    }
  }

  getErrorMessage(field: string) {
    if (field == 'name' && this.formRegister.get('name')?.hasError('required')) 
      return '*Nombre es requerido';

    if (field == 'lastName' && this.formRegister.get('lastName')?.hasError('required')) 
      return '*Apellido es requerido';
    
    if ((field == 'email') && (this.formRegister.get('email')?.hasError('required') || this.formRegister.get('email')?.hasError('pattern'))) 
      return '*Email no es válido';
    
    if ((field == 'password') && (this.formRegister.get('password')?.hasError('required') ||
        this.formRegister.get('password')?.hasError('maxlength') ||
        this.formRegister.get('password')?.hasError('minlength')))
      return '*Contraseña entre 6 y 20 caracteres';
    
    if(field == 'passwordConfirm' && (this.formRegister.get('passwordConfirm')?.hasError('required')))
      return 'Repite la contraseña';
    
    if(field == 'terms' && this.formRegister.get('terms')?.hasError('required'))
      return 'Debe aceptar los Términos y Condiciones';

    return '';
  }
}
