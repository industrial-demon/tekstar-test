import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockData } from '../types/mock-data';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
  standalone: true,
})
export class ProductDialogComponent implements OnInit {
  public readonly data = inject<MockData>(MAT_DIALOG_DATA);

  ngOnInit() {
  }

}
