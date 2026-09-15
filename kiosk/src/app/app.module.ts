import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KioskService } from './services/kiosk.service';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DetailsComponent } from './pages/details/details.component';
import { DepartmentComponent } from './pages/department/department.component';
import { QueueComponent } from './pages/queue/queue.component';
import { UploadDocumentsComponent } from './pages/documents/upload-documents.component';
import { TranslatePipe } from './i18n/translate.pipe';
import { TranslationService } from './i18n/translation.service';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    DetailsComponent,
    DepartmentComponent,
    QueueComponent,
    UploadDocumentsComponent,
    TranslatePipe,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [KioskService, TranslationService],
  bootstrap: [AppComponent],
})
export class AppModule {}