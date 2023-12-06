import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppComponent } from './app.component';
import { EducationalObjectiveComponent } from './pieces/educational-objective/educational-objective.component';
import { RoleComponent } from './pieces/role/role.component';
import { MissionContextComponent } from './pieces/mission-context/mission-context.component';
import { GameEducationnalObjectiveComponent } from './pieces/game-educationnal-objective/game-educationnal-objective.component';
import { GameContextComponent } from './pieces/game-context/game-context.component';
import { TaskComponent } from './pieces/tasks/task/task.component';
import { AnnexeTaskComponent } from './pieces/tasks/annexe-task/annexe-task.component';
import { CommentsComponent } from './sider-pieces/comments/comments.component';
import { RepeatComponent } from './sider-pieces/repeat/repeat.component'; 
import { CommentComponent } from './components/comment/comment.component';
import { RandomEventComponent } from './pieces/tasks/random-event/random-event.component';
import { CharactersComponent } from './sider-pieces/characters/characters.component';
import { RulesComponent } from './pieces/rules/rules.component';
import { StepComponent } from './pieces/step/step.component';
import { FinalTaskComponent } from './pieces/tasks/final-task/final-task.component';
import { RepeatTaskComponent } from './pieces/tasks/repeat-task/repeat-task.component';
import { InteruptComponent } from './sider-pieces/interupt/interupt.component';
import { OptionnalTaskComponent } from './pieces/tasks/optionnal-task/optionnal-task.component';
import { RoleOccurenceComponent } from './sider-pieces/role-occurence/role-occurence.component';
import { SupplementaryTaskComponent } from './sider-pieces/supplementary-task/supplementary-task.component';
import { SuppressDialogComponent } from './components/dialogs/suppress-dialog/suppress-dialog.component';

import { DragScrollDirective } from './directives/drag-scroll.directive';
import { MouseWheelZoomDirective } from './directives/mouse-wheel-zoom.directive';
import { CleanDialogComponent } from './components/dialogs/clean-dialog/clean-dialog.component';
import { CreateDialogComponent } from './components/dialogs/create-dialog/create-dialog.component';
import { GameCharactersComponent } from './pieces/game-characters/game-characters.component';
import { SaveDialogComponent } from './components/dialogs/save-dialog/save-dialog.component';
import { IdentifierSnackbarComponent } from './components/snackbars/identifier-snackbar/identifier-snackbar.component';
import { LoadingsucessSnackbarComponent } from './components/snackbars/loadingsucess-snackbar/loadingsucess-snackbar.component';
import { LoadingfailSnackbarComponent } from './components/snackbars/loadingfail-snackbar/loadingfail-snackbar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { FinishTutorialComponent } from './components/snackbars/finish-tutorial/finish-tutorial.component';
import { VerifyGameFailSnackbarComponent } from './components/snackbars/verify-game-fail-snackbar/verify-game-fail-snackbar.component';
import { VerifyDialogComponent } from './components/dialogs/verify-dialog/verify-dialog.component';
import { RoleNameDuplicateComponent } from './components/snackbars/role-name-duplicate/role-name-duplicate.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    EducationalObjectiveComponent,
    RoleComponent,
    MissionContextComponent,
    GameEducationnalObjectiveComponent,
    GameContextComponent,
    TaskComponent,
    AnnexeTaskComponent,
    DragScrollDirective,
    MouseWheelZoomDirective,
    CommentsComponent,
    RepeatComponent,
    CommentComponent,
    RandomEventComponent,
    CharactersComponent,
    RulesComponent,
    StepComponent,
    FinalTaskComponent,
    RepeatTaskComponent,
    InteruptComponent,
    OptionnalTaskComponent,
    RoleOccurenceComponent,
    SupplementaryTaskComponent,
    SuppressDialogComponent,
    CleanDialogComponent,
    CreateDialogComponent,
    GameCharactersComponent,
    SaveDialogComponent,
    IdentifierSnackbarComponent,
    LoadingsucessSnackbarComponent,
    LoadingfailSnackbarComponent,
    TutorialComponent,
    FinishTutorialComponent,
    VerifyGameFailSnackbarComponent,
    VerifyDialogComponent,
    RoleNameDuplicateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
