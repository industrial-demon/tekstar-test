import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
  provideHttpClient,
} from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MockData } from './types/mock-data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { catchError, delay, of, Subject, switchMap, tap } from 'rxjs';
import { ProductDialogComponent } from './product-dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly title = signal('tekstar-test');
  protected readonly loading = signal<boolean>(false);
  readonly data = signal<MockData | null>(null);

  private readonly dialogSubject = new Subject<void>();

  onOpenDialog(): void {
    this.dialogSubject.next();
  }

  ngOnInit(): void {
    const fetch$ = this.http
      .get<MockData>('assets/mock-data.json')
      .pipe(catchError((e: HttpErrorResponse) => of(e)));

    fetch$
      .pipe(
        tap(() => {
          this.loading.set(true);
        }),
        // delay(4000),
        tap(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((resp) => {
        if (resp instanceof HttpErrorResponse) {
          this.snackBar.open('Smething went wrong','', {
            duration: 500
          });
        }

        if ('id' in resp) {
          this.data.set(resp);
        }
      });

    this.dialogSubject
      .asObservable()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() =>
          this.dialog
            .open(ProductDialogComponent, {
              data: this.data(),
            })
            .afterClosed()
        )
      )
      .subscribe((data) => {
        // alert(`Editable data sending to server: ${JSON.stringify(data)}`)
      });
  }
}
