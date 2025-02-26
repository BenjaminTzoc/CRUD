import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginModel } from 'src/app/core/models/login.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { CustomvalidationService } from 'src/app/core/services/customValidation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild('passwordInput') passwordInput: ElementRef | any;
  eyeClass: string = 'bi-eye-fill';
  isShowing: boolean = false;
  showValidationErrors: boolean = false;
  loginModel: LoginModel = {} as LoginModel;
  msg: string = "";

  form: FormGroup = this.fb.group({
    email: ['',[Validators.required,Validators.pattern(this.customValidator.emailValidation())]],
    password: ['',Validators.required]
  });

  destroyloginMsg?: Subscription;

  constructor(
    private fb: FormBuilder, 
    readonly authService: AuthService,
    private customValidator: CustomvalidationService) { }

  ngOnDestroy(): void {
    if (this.destroyloginMsg) {
      this.destroyloginMsg.unsubscribe();
    }
  }
  
  ngOnInit(): void {
    this.isLoggedIn();
    this.destroyloginMsg = this.authService.currentLoginMsg.subscribe(responseItem =>{
        this.msg = responseItem.msg;
    });
  }

  login() {
    const val = this.form.value;

    if (this.form.valid) {
      this.loginModel = {'username': val.email, 'password': val.password};
      this.authService.login(this.loginModel);
      
      this.showValidationErrors = false;
    }else{
      this.showValidationErrors = true;
    }
  }

  isLoggedIn(){
    this.authService.isLoggedIn()
  }

  showPass(){
    if (this.isShowing) {
      this.passwordInput.nativeElement.type = 'password';
      this.eyeClass = 'bi-eye-fill';
      this.isShowing = false;
    } else {
      this.passwordInput.nativeElement.type = 'text';
      this.eyeClass = 'bi-eye-slash-fill';
      this.isShowing = true;
    }
  }

  getErrorMessage(field: string) {
    if ((field == 'email') && 
      (this.form.get('email')?.hasError('required') || 
      this.form.get('email')?.hasError('pattern'))) 
      return 'Debe ingresar un email válido';
    
    if (field == 'password' && (this.form.get('password')?.hasError('required')))
        return 'Debe ingresar una contraseña';

    return '';
  }
}
