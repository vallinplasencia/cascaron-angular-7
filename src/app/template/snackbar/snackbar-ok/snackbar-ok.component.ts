import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-snackbar-ok',
  templateUrl: './snackbar-ok.component.html',
  styleUrls: ['./snackbar-ok.component.css']
})
export class SnackbarOkComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }
  cerrar(){
    this.snackBar.dismiss();
  }
}
