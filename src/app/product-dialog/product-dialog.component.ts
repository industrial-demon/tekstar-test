import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MockData } from '../types/mock-data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
  styleUrls: ['./product-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule]
})
export class ProductDialogComponent implements OnInit {
  private readonly data = inject<MockData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef);
  product: MockData = this.data;
  ngOnInit() {}

  onClose(): void {
    this.dialogRef.close()
  }
}
