import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EducationalObjectiveComponent } from './pieces/educational-objective/educational-objective.component';
import { RoleComponent } from './pieces/role/role.component';
import { MissionContextComponent } from './pieces/mission-context/mission-context.component';
import { GameEducationnalObjectiveComponent } from './pieces/game-educationnal-objective/game-educationnal-objective.component';
import { GameContextComponent } from './pieces/game-context/game-context.component';
import { TaskComponent } from './pieces/task/task.component';
import { AnnexeTaskComponent } from './pieces/annexe-task/annexe-task.component';

import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { DragScrollDirective } from './directives/drag-scroll.directive'; 

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
    DragScrollDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
