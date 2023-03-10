import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { EducationalObjectiveComponent } from './pieces/educational-objective/educational-objective.component';
import { RoleComponent } from './pieces/role/role.component';
import { MissionContextComponent } from './pieces/mission-context/mission-context.component';
import { GameEducationnalObjectiveComponent } from './pieces/game-educationnal-objective/game-educationnal-objective.component';
import { GameContextComponent } from './pieces/game-context/game-context.component';
import { TaskComponent } from './pieces/task/task.component';
import { AnnexeTaskComponent } from './pieces/annexe-task/annexe-task.component';
import { CommentsComponent } from './sider-pieces/comments/comments.component';
import { RepeatComponent } from './sider-pieces/repeat/repeat.component'; 
import { CommentComponent } from './components/comment/comment.component';
import { RandomEventComponent } from './pieces/random-event/random-event.component';
import { CharactersComponent } from './sider-pieces/characters/characters.component';
import { CharacterComponent } from './components/character/character.component';
import { RulesComponent } from './sider-pieces/rules/rules.component';
import { StepComponent } from './pieces/step/step.component';
import { FinalTaskComponent } from './pieces/final-task/final-task.component';

import { DragScrollDirective } from './directives/drag-scroll.directive';
import { MouseWheelZoomDirective } from './directives/mouse-wheel-zoom.directive';

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
    CharacterComponent,
    RulesComponent,
    StepComponent,
    FinalTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
