import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomvalidationService {

  constructor() { }

  integerPattern(){
    return '^([1-9][0-9]*)$';
  }

  integerPatternWithOneBlank(){
    return '^([1-9][0-9]*)((\\s)?([0-9]))*$'
  }

  integerPatternCero(){
    return '^((0)|([1-9][0-9]*))$';
  }

  urlPatternBusiness(){
    return '^[a-z\\d]+-?[a-z\\d]+$';
  }

  namePatterBusiness(){
    return '^[a-zA-z]+((\\s[a-zA-Z\\d]+)+)?$';
  }

  categoryPatternName(){
    return '^[\\w\-\\s\\ñ\\áéíóúýÁÉÍÓÚ]+$';
  }

  emailValidation(){
    return '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'
  }

  booleanValidation(){
    return '^(0|1)$';
  }

  wspUrlApi(){
    return '^(https:\/\/api.whatsapp.com\/message\/).*$';
  }

  instagramValidation(){
    return '^(https:\/\/www.instagram.com\/).*$';
  }

  facebookValidation(){
    return '^(https:\/\/www.facebook.com\/).*$'
  }
  
}