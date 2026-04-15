import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-rating-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  template: `
    <h2 mat-dialog-title>Oceń film</h2>
    <mat-dialog-content>
      <div style="display: flex; flex-direction: column; gap: 15px; padding-top: 10px;">
        <mat-form-field appearance="outline">
          <mat-label>Rate (0-10)</mat-label>
          <input matInput type="number" [(ngModel)]="data.Rating" min="0" max="10" step="0.5">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Note (optional)</mat-label>
          <textarea matInput [(ngModel)]="data.Comment" rows="3"></textarea>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="data" [disabled]="data.Rating === null || data.Rating < 0 || data.Rating > 10">
        Save
      </button>
    </mat-dialog-actions>
  `
})
export class MovieRatingDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MovieRatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { Rating: number | null, Comment: string }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}