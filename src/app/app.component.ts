import { ChangeDetectorRef, Component, ElementRef, HostListener, SimpleChanges, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mission } from './class/mission/mission';
import { Scenario } from './class/scenario/scenario';
import { Step } from './class/step/step';
import { Task } from './class/task/task';
import { Role } from './class/role/role';
import { GameContext } from './class/game-context/game-context';
import { GameEducationnalObjective } from './class/game-educationnal-objective/game-educationnal-objective';
import { Character } from './class/character/character';
import { Ressource } from './class/ressource/ressource';
import { MissionContext } from './class/mission-context/mission-context';
import { EducationnalObjective } from './class/educationnal-objective/educationnal-objective';
import { RoleOccurrence } from './class/role-occurrence/role-occurrence';
import { SupplementaryRole } from './class/supplementary-role/supplementary-role';
import { Symbol } from './class/symbol/symbol';
import { PieceDetailsService } from './services/piece-details/piece-details.service';
import { Comment } from './class/comment/comment';
import { Reward } from './class/rewards/reward';
import { SkillReward } from './class/rewards/skill-reward/skill-reward';
import { CharacterReward } from './class/rewards/character-reward/character-reward';
import { QuestReward } from './class/rewards/quest-reward/quest-reward';
import { ObjectsReward } from './class/rewards/objects-reward/objects-reward';
import { ObjectiveReward } from './class/rewards/objective-reward/objective-reward';
import { OtherReward } from './class/rewards/other-reward/other-reward';
import { PrerequireRessource } from './class/prerequires/prerequire-ressource/prerequire-ressource';
import { TooltipService } from './services/tooltip/tooltip.service';
import { ZoomService } from './services/zoom/zoom.service';
import { MatDialog } from '@angular/material/dialog';
import { SaveDialogComponent } from './components/dialogs/save-dialog/save-dialog.component';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Trace } from './class/trace/trace';
import Minimap from 'js-minimap';
import { MinimapService } from './services/minimap/minimap.service';
import { TranslateService } from '@ngx-translate/core';
import { TutorialService } from './services/tutorial/tutorial.service';
import { VerifyDialogComponent } from './components/dialogs/verify-dialog/verify-dialog.component';
import { LegalDialogComponent } from './components/dialogs/legal-dialog/legal-dialog.component';
import { CreateOptionnalTaskDialogComponent } from './components/dialogs/create-optionnal-task-dialog/create-optionnal-task-dialog.component';
import { UnityService } from './services/unity/unity.service';
import { Discussion } from './class/discussion/discussion';
import { Response } from './class/response/response';
import { InterrogativeSentence } from './class/sentence/interrogativeSentence/interrogative-sentence';
import { DeclarativeSentence } from './class/sentence/declarativeSentence/declarative-sentence';
import { ObjectReward } from './class/rewards/object-reward/object-reward';
import { DiscussionReward } from './class/rewards/discussion-reward/discussion-reward';
import { RoleEducationnalObjective } from './class/role-educationnal-objective/role-educationnal-objective';
import { ExportUnity } from './class/exportUnity/export-unity';
import { RandomObjectsReward } from './class/rewards/random-objects-reward/random-objects-reward';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { LinkedFile } from './class/linked-file/linked-file';
import { TracesService } from './services/traces/traces.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'RLG Maker';
  scenario: Scenario = new Scenario();
  @ViewChild('fileInput') fileInput: any;
  selectedLang: string = 'en';
  siderFolded: boolean = false;
  ctrlPressed: boolean = false;

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient, protected pieceDetailsService: PieceDetailsService, protected tooltipService: TooltipService,
    private elementRef: ElementRef, protected zoomService: ZoomService, private dialog: MatDialog, private titleService: Title,
    private _snackBar: MatSnackBar, protected minimapService: MinimapService, protected translate: TranslateService, protected tutorialService: TutorialService,
    protected unityService: UnityService, private sanitizer: DomSanitizer, private tracesService: TracesService) {

    translate.setTranslation('en', require('../assets/lang/en.json'));
    translate.setTranslation('fr', require('../assets/lang/fr.json'));  
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    let browserLang = translate.getBrowserLang();
    let selectedLang = browserLang && (browserLang.match(/en|fr/) ? browserLang : 'en');
    if(selectedLang) {
      this.selectedLang = selectedLang;
    }
    translate.use(this.selectedLang);

    pieceDetailsService.piece = this.scenario;

    this.scenario.missions.forEach(mission => {
      mission.equalizeLengths();
    });
  }

  ngOnInit(): void {
    const container = this.elementRef.nativeElement.querySelector('.container-appDragScroll');
    const target = this.elementRef.nativeElement.querySelector('.container-minimap');
    container.scrollTo(0,500);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: any) {
    const message = "Êtes vous sûr de vouloir quitter RLG Maker ?\nVous risquez de perdre les données non sauvegardées.";
    event.returnValue = message;
    return message;
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      let fileName: string = this.scenario.projectName;
      if (this.scenario.projectName == '') {
        fileName = "Scénario - RLG Maker";
        this.titleService.setTitle('RLG Maker'); 
      } else {
        fileName = this.scenario.projectName+' - RLG Maker';
        this.titleService.setTitle('RLG Maker - '+this.scenario.projectName);
      }
      this.scenario.tooltips = this.tooltipService.activatedTooltips;
      this.scenario.unity_isActive = this.unityService.unity_isActive;
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'quick_save', undefined, undefined, 'all', 'Scenario'));
      const jsonString = JSON.stringify(this.scenario,undefined,2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  }
  
  @HostListener('document:keydown', ['$event'])
  onCtrlDown(event: KeyboardEvent) {
    if (event.key == 'Shift') {
      this.ctrlPressed = true;      
    }
  }

  @HostListener('document:keyup', ['$event'])
  onCtrlUp(event: KeyboardEvent) {
    if (event.key == 'Shift') {
      this.ctrlPressed = false;
    }
  }

  getInlineTaskIndex(role: Role, inlineTask: Array<Task|null>): number {
    return role.tasks.findIndex(element => element == inlineTask);
  }

  taskDrop(event: CdkDragDrop<(Task | null)[]>, mission: Mission, role: Role, missionIndex: number, roleIndex: number) {

    let actualInlineTaskIndex: number = this.getInlineTaskIndex(role, event.previousContainer.data);
    let destinationInlineTaskIndex: number = this.getInlineTaskIndex(role, event.container.data);
    let traceTaskType: string;
    let traceTaskColor: string;
    switch ((event.previousContainer.data[event.previousIndex] as Task).type) {
      case 'annexe': traceTaskType = 'Side_task'; traceTaskColor = '#BCCECC'; break;
      case 'optionnal': traceTaskType = 'Opt_task'; traceTaskColor = '#E8E3B3'; break;
      case 'final': traceTaskType = 'Final_task'; traceTaskColor = '#B28386'; break;
      case 'event': traceTaskType = 'Event_task'; traceTaskColor = '#BFDAA3'; break;
      case 'repeat': traceTaskType = 'Repeat_task'; traceTaskColor = '#ABBCC6'; break;
      case 'normal': traceTaskType = 'Task'; traceTaskColor = '#B9DFE3'; break;
      default: traceTaskType = 'nullTask'; traceTaskColor = '#F7F7F7'; break;
    }
    if (event.previousContainer.data[event.previousIndex] instanceof Task
      && ((event.previousContainer.data[event.previousIndex] as Task).type == 'repeat' || (event.previousContainer.data[event.previousIndex] as Task).type == 'final')) {

      if (event.previousContainer === event.container) {
        if (!event.container.data.slice(event.currentIndex).some(element => element instanceof Task)) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
          this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'dragMove', missionIndex, roleIndex, 'all', traceTaskType + '_[' + actualInlineTaskIndex + ';' + event.previousIndex + ']', traceTaskColor, undefined, '[' + destinationInlineTaskIndex + ';' + event.currentIndex + ']'));
        } else {
          this._snackBar.open(this.translate.instant('snackbar_moveFinalTask_moveBeforeTasks'), '', { duration: 5000, panelClass: 'snackbar-fail' });
        }
      } else {
        if (event.container.data.some(element => element?.type == 'final' || element?.type == 'repeat')) {
          let tmp: Task = event.previousContainer.data[event.previousIndex] as Task;
          event.previousContainer.data[event.previousIndex] = event.container.data[event.currentIndex];
          event.container.data[event.currentIndex] = tmp;
          this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'dragMove', missionIndex, roleIndex, 'all', traceTaskType + '_[' + actualInlineTaskIndex + ';' + event.previousIndex + ']', traceTaskColor, undefined, '[' + destinationInlineTaskIndex + ';' + event.currentIndex + ']'));
          this._snackBar.open(this.translate.instant('snackbar_moveFinalTask_inversion'), '', { duration: 5000, panelClass: 'snackbar-warning' });
        } else if (event.container.data.slice(event.currentIndex).some(element => element instanceof Task)) {
          let lastTaskIndex: number;
          if (event.container.data.some(element => element instanceof Task)) {
            lastTaskIndex = event.container.data.length - 1;
            while (!(event.container.data[lastTaskIndex] instanceof Task)) {
              lastTaskIndex--;
            }
          } else {
            lastTaskIndex = 0;
          }
          transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, lastTaskIndex + 1);
          this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'dragMove', missionIndex, roleIndex, 'all', traceTaskType + '_[' + actualInlineTaskIndex + ';' + event.previousIndex + ']', traceTaskColor, undefined, '[' + destinationInlineTaskIndex + ';' + event.currentIndex + ']'));
          this._snackBar.open(this.translate.instant('snackbar_moveFinalTask_taskPlacedAtEnd'), '', { duration: 5000, panelClass: 'snackbar-warning' });
        } else {
          transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
          this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'dragMove', missionIndex, roleIndex, 'all', traceTaskType + '_[' + actualInlineTaskIndex + ';' + event.previousIndex + ']', traceTaskColor, undefined, '[' + destinationInlineTaskIndex + ';' + event.currentIndex + ']'));
        }
      }
      if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase - 1] && this.tutorialService.isActive && this.tutorialService.phase == 8) {
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'valid_phase', undefined, undefined, 'phase_' + this.tutorialService.phase, 'Tutorial'));
        this.tutorialService.validPhase();
      }
    } else {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'dragMove', missionIndex, roleIndex, 'all', traceTaskType + '_[' + actualInlineTaskIndex + ';' + event.previousIndex + ']', traceTaskColor, undefined, '[' + destinationInlineTaskIndex + ';' + event.currentIndex + ']'));
      } else {
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'dragMove', missionIndex, roleIndex, 'all', traceTaskType + '_[' + actualInlineTaskIndex + ';' + event.previousIndex + ']', traceTaskColor, undefined, '[' + destinationInlineTaskIndex + ';' + event.currentIndex + ']'));
      }
      if (event.container.data.some(element => element?.type == 'final' || element?.type == 'repeat')
        && event.container.data.findIndex(element => element?.type == 'final' || element?.type == 'repeat') < event.currentIndex) {
        moveItemInArray(event.container.data, event.currentIndex, event.container.data.findIndex(element => element?.type == 'final' || element?.type == 'repeat'));
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'dragMove', missionIndex, roleIndex, 'all', traceTaskType + '_[' + actualInlineTaskIndex + ';' + event.previousIndex + ']', traceTaskColor, undefined, '[' + destinationInlineTaskIndex + ';' + event.currentIndex + ']'));
        this._snackBar.open(this.translate.instant('snackbar_moveTask_movedBeforeEndlineTask'), '', { duration: 5000, panelClass: 'snackbar-warning' });
      }
      if (event.previousContainer.data[event.previousIndex] instanceof Task && (event.previousContainer.data[event.previousIndex] as Task).type == 'optionnal') {
        this._snackBar.open(this.translate.instant('snackbar_moveOptionnalTask'), '', { duration: 5000, panelClass: 'snackbar-warning' });
      }
      if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase - 1] && this.tutorialService.isActive && this.tutorialService.phase == 8) {
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'valid_phase', undefined, undefined, 'phase_' + this.tutorialService.phase, 'Tutorial'));
        this.tutorialService.validPhase();
      }
    }
    mission.equalizeLengths();
    this.minimapService.reset();
    this.cdr.detectChanges();
  }

  stepDrop(event: CdkDragDrop<(Step|null)[]>, mission: Mission, parent: Role | Mission, missionIndex: number, roleIndex: number|undefined) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex); 
    mission.equalizeLengths();
    this.minimapService.reset();
    this.cdr.detectChanges();

    if (parent instanceof Mission) {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'dragMove',missionIndex,undefined,'all','Step_m_['+event.previousIndex+']','#ACC9FC',undefined,'['+event.currentIndex+']'));
    } else if (parent instanceof Role) {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'dragMove',missionIndex,roleIndex,'all','Step_r_['+event.previousIndex+']','#ACC9FC',undefined,'['+event.currentIndex+']'));
    }
  }

  changeLanguage(lang: string): void {
    if (lang !== this.selectedLang) {
      switch(lang) {
        case 'fr': this.selectedLang = 'fr'; this.translate.use('fr'); break;
        case 'en': this.selectedLang = 'en'; this.translate.use('en'); break;
      }
      this.minimapService.reset();
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'change_lang', undefined, undefined, 'all', 'Scenario', undefined, undefined, this.selectedLang));
    }
  }

  changeMode(): void {
    this.unityService.unity_isActive = !this.unityService.unity_isActive
  }

  downloadManual(): void {
    const manualUrl = './assets/GuideMaker_v2.3.pdf';
    this.http.get(manualUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'GuideMaker_v2.3.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  downloadFile(): void {
    let fileName: string = this.scenario.projectName;
    const dialogRef = this.dialog.open(SaveDialogComponent, {
      data: {
        fileName: fileName,
        result: false
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data && data.result) {
        if (data.fileName == '') {
          fileName = "Scénario - RLG Maker";
          this.titleService.setTitle('RLG Maker');
        } else {
          this.scenario.projectName = data.fileName;
          fileName = data.fileName + ' - RLG Maker';
          this.titleService.setTitle('RLG Maker - ' + this.scenario.projectName);
        }
        this.scenario.tooltips = this.tooltipService.activatedTooltips;
        this.scenario.unity_isActive = this.unityService.unity_isActive;
        this.scenario.tutorial_isActive = this.tutorialService.isActive;
        this.scenario.tutorial_phase = this.tutorialService.phase;
        this.scenario.tutorial_optionnalPhase = this.tutorialService.optionnalPhase;
        this.scenario.tutorial_phaseDone = this.tutorialService.phaseDone;
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'save', undefined, undefined, 'all', 'Scenario'));

        const jsonString = JSON.stringify(this.scenario, undefined, 2);
        const zip = new JSZip();
        zip.file('save.json', jsonString);
        const tracesJsonString = JSON.stringify(this.tracesService.traces,undefined,2);
        zip.file('traces.json', tracesJsonString);

        const filesFolder = zip.folder('files');
        const filePromises: Promise<void>[] = [];

        this.scenario.files.forEach((linkedFile, linkedFileIndex) => {
          const filePromise = new Promise<void>((resolve, reject) => {
            let fileFolder = filesFolder?.folder(linkedFile.folder);
            let reader = new FileReader();
            reader.onload = () => {
              fileFolder?.file(linkedFile.id + '.' + linkedFile.extension, reader.result as ArrayBuffer);
              resolve();
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(linkedFile.file);
          });
          filePromises.push(filePromise);
        });

        Promise.all(filePromises).then(() => {
          zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
            saveAs(content, fileName + '.zip');
          });
        })

      } else {
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'cancel_save', undefined, undefined, 'all', 'Scenario'));
      }
    });
  }

  selectFile(): void {
    this.fileInput.nativeElement.click();
  }
  
  onFileSelected(event: any): void {
    const selectedFile: File = event.target.files[0];
    if (selectedFile) {
      const reader: FileReader = new FileReader();
      
      reader.onload = (e) => {
        const arrayBuffer = (e.target as FileReader).result;
        if (arrayBuffer) {
          const jszip = new JSZip();
          jszip.loadAsync(arrayBuffer).then((zip) => {

            zip.forEach((relativePath, file) => {

              if (relativePath == 'traces.json') {
                file.async('string').then((content) => {
                  this.tracesService.traces = JSON.parse(content);
                });
              }

              if (relativePath == 'save.json') {
                file.async('string').then((content) => {

                  try {
                    const jsonData: any = JSON.parse(content);
                    const scenario: Scenario = Object.assign(new Scenario(), jsonData);
                    this.tooltipService.activatedTooltips = scenario.tooltips;
                    this.unityService.unity_isActive = scenario.unity_isActive;
                    this.tutorialService.isActive = scenario.tutorial_isActive;
                    this.tutorialService.phase = scenario.tutorial_phase;
                    this.tutorialService.optionnalPhase = scenario.tutorial_optionnalPhase;
                    this.tutorialService.phaseDone = scenario.tutorial_phaseDone;
                    scenario.context = Object.assign(new GameContext(), jsonData.context);
                    scenario.context.comments = jsonData.context.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
                    scenario.educationnalObjective = Object.assign(new GameEducationnalObjective(), jsonData.educationnalObjective);
                    scenario.educationnalObjective.comments = jsonData.educationnalObjective.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
                    scenario.gameRules = jsonData.gameRules;
                    scenario.characters = jsonData.characters.map((characterData: any) => Object.assign(new Character(), characterData));
                    scenario.ressources = jsonData.ressources.map((ressourceData: any) => Object.assign(new Ressource(), ressourceData));
                    scenario.comments = jsonData.comments.map((commentData: any) => Object.assign(new Comment(), commentData));

                    scenario.files.forEach(async linkedFile => {
                      let fileFolder = zip.folder('files')?.folder(linkedFile.folder);
                      if (fileFolder) {
                        const fileName = linkedFile.id+'.'+linkedFile.extension;
                        const jsfile = fileFolder.file(fileName);
  
                        if (jsfile) {
                          const blob = await jsfile.async('blob');
                          const file = new File([blob], linkedFile.name+'.'+linkedFile.extension, { type: linkedFile.mimeType });
                          linkedFile.file = file;
                          linkedFile.fileURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));
                        }
                      }
                    });

                    scenario.missions = jsonData.missions.map((missionData: any) => Object.assign(new Mission(), missionData));
                    scenario.missions.forEach((mission, index) => {
                      mission.chronologie = jsonData.missions[index].chronologie.map((chronologieData: any) => {
                        if (chronologieData !== null) {
                          return Object.assign(new Step(), chronologieData);
                        } else {
                          return null;
                        }
                      });
                      mission.chronologie.forEach((step) => {
                        if (step instanceof Step) {
                          step.comments = step.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
                        }
                      });
                      mission.comments = jsonData.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
                      mission.context = Object.assign(new MissionContext(), jsonData.missions[index].context);
                      mission.context.comments = jsonData.missions[index].context.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
                      mission.educationnalObjective = Object.assign(new EducationnalObjective(), jsonData.missions[index].educationnalObjective);
                      mission.educationnalObjective.comments = jsonData.missions[index].educationnalObjective.comments.map((commentData: any) => Object.assign(new Comment, commentData));
                      mission.rewards = mission.rewards.map((rewardData: any) => {
                        if (rewardData.type == 'skill') {
                          return Object.assign(new SkillReward(), rewardData);
                        }
                        if (rewardData.type == 'character') {
                          return Object.assign(new CharacterReward(), rewardData);
                        }
                        if (rewardData.type == 'object') {
                          return Object.assign(new ObjectReward(), rewardData);
                        }
                        if (rewardData.type == 'randomObjects') {
                          return Object.assign(new RandomObjectsReward(), rewardData);
                        }
                      });
                      mission.rewards.forEach((reward: Reward, index: number) => {
                        if (reward instanceof CharacterReward) {
                          let i: number = scenario.characters.findIndex(element => element.color == reward.character.color && element.description == reward.character.description && element.name == reward.character.name);
                          reward.character = scenario.characters[i];
                        }
                        if (reward instanceof ObjectReward) {
                          if (scenario.ressources.some(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number)) {
                            let i: number = scenario.ressources.findIndex(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number);
                            reward.object = scenario.ressources[i];
                          }
                        }
                        if (reward instanceof RandomObjectsReward) {
                          reward.objects.forEach((object, objectIndex) => {
                            if (scenario.ressources.some(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number)) {
                              let i: number = scenario.ressources.findIndex(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number);
                              reward.objects[objectIndex] = scenario.ressources[i];
                            }
                          });
                        }
                      });
                      mission.roles = jsonData.missions[index].roles.map((roleData: any) => Object.assign(new Role(), roleData));
                      mission.roles.forEach((role, index) => {
                        role.comments = role.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
                        role.chronologie = mission.roles[index].chronologie.map((chronologieData: any) => {
                          if (chronologieData !== null) {
                            return Object.assign(new Step(), chronologieData);
                          } else {
                            return null;
                          }
                        });
                        role.chronologie.forEach((step) => {
                          if (step instanceof Step) {
                            step.comments = step.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
                          }
                        });
                        role.ressources = role.ressources.map((ressourceData: any) => Object.assign(new Ressource(), ressourceData));
                        role.occurences = role.occurences.map((occurrenceData: any) => Object.assign(new RoleOccurrence(), occurrenceData));
                        role.supplementaryRoles = role.supplementaryRoles.map((supplementaryRoleData: any) => Object.assign(new SupplementaryRole(), supplementaryRoleData));
                        role.rewards = role.rewards.map((rewardData: any) => {
                          if (rewardData.type == 'skill') {
                            return Object.assign(new SkillReward(), rewardData);
                          }
                          if (rewardData.type == 'character') {
                            return Object.assign(new CharacterReward(), rewardData);
                          }
                          if (rewardData.type == 'quest') {
                            return Object.assign(new QuestReward(), rewardData);
                          }
                          if (rewardData.type == 'objects') {
                            return Object.assign(new ObjectsReward(), rewardData);
                          }
                          if (rewardData.type == 'objective') {
                            rewardData.objective = Object.assign(new RoleEducationnalObjective(), rewardData.objective)
                            return Object.assign(new ObjectiveReward(), rewardData);
                          }
                          if (rewardData.type == 'other') {
                            return Object.assign(new OtherReward(), rewardData);
                          }
                          if (rewardData.type == 'object') {
                            return Object.assign(new ObjectReward(), rewardData);
                          }
                          if (rewardData.type == 'discussion') {
                            return Object.assign(new DiscussionReward(), rewardData);
                          }
                          if (rewardData.type == 'randomObjects') {
                            return Object.assign(new RandomObjectsReward(), rewardData);
                          }
                        });
                        role.rewards.forEach((reward: Reward, index: number) => {
                          if (reward instanceof SkillReward) {
                            let i: number = role.ressources.findIndex(element => element.type == 'attribut' && element.name == reward.skill.name && element.number == reward.skill.number);
                            reward.skill = role.ressources[i];
                          }
                          if (reward instanceof CharacterReward) {
                            let i: number = scenario.characters.findIndex(element => element.color == reward.character.color && element.description == reward.character.description && element.name == reward.character.name);
                            reward.character = scenario.characters[i];
                          }
                          if (reward instanceof ObjectiveReward) {
                            let i: number = role.educationnalObjectives.findIndex(element => element.objective == reward.objective.objective);
                            reward.objective = role.educationnalObjectives[i];
                          }
                          if (reward instanceof ObjectReward) {
                            if (scenario.ressources.some(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number)) {
                              let i: number = scenario.ressources.findIndex(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number);
                              reward.object = scenario.ressources[i];
                            } else {
                              let i: number = role.ressources.findIndex(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number);
                              reward.object = role.ressources[i];
                            }
                          }
                          if (reward instanceof RandomObjectsReward) {
                            reward.objects.forEach((object, objectIndex) => {
                              if (scenario.ressources.some(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number)) {
                                let i: number = scenario.ressources.findIndex(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number);
                                reward.objects[objectIndex] = scenario.ressources[i];
                              } else {
                                let i: number = role.ressources.findIndex(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number);
                                reward.objects[objectIndex] = role.ressources[i];
                              }
                            });
                          }
                        });
                        role.discussions = role.discussions.map((discussionData: any) => {
                          let character: Character | undefined = scenario.characters.find(char => char.color == discussionData.character.color 
                            && char.description == discussionData.character.description && char.name == discussionData.character.name && char.tel == discussionData.character.tel);
                          let discussion: Discussion = Object.assign(
                            new Discussion(
                              discussionData.ID,
                              character as Character,
                              discussionData.name
                            ),
                            discussionData
                          );
                          discussion.character = character as Character;
                          discussion.rewards = discussion.rewards.map((rewardData: any) => {
                            if (rewardData.type == 'skill') {
                              return Object.assign(new SkillReward(), rewardData);
                            }
                            if (rewardData.type == 'character') {
                              return Object.assign(new CharacterReward(), rewardData);
                            }
                            if (rewardData.type == 'quest') {
                              return Object.assign(new QuestReward(), rewardData);
                            }
                            if (rewardData.type == 'object') {
                              return Object.assign(new ObjectReward(), rewardData);
                            }
                            if (rewardData.type == 'discussion') {
                              return Object.assign(new DiscussionReward(), rewardData);
                            }
                            if (rewardData.type == 'randomObjects') {
                              return Object.assign(new RandomObjectsReward(), rewardData);
                            }
                          });
                          discussion.rewards.forEach((reward: Reward, index: number) => {
                            if (reward instanceof SkillReward) {
                              let i: number = role.ressources.findIndex(element => element.type == 'attribut' && element.name == reward.skill.name && element.number == reward.skill.number);
                              reward.skill = role.ressources[i];
                            }
                            if (reward instanceof CharacterReward) {
                              let i: number = scenario.characters.findIndex(element => element.color == reward.character.color && element.description == reward.character.description && element.name == reward.character.name);
                              reward.character = scenario.characters[i];
                            }
                            if (reward instanceof ObjectReward) {
                              if (scenario.ressources.some(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number)) {
                                let i: number = scenario.ressources.findIndex(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number);
                                reward.object = scenario.ressources[i];
                              } else {
                                let i: number = role.ressources.findIndex(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number);
                                reward.object = role.ressources[i];
                              }
                            }
                            if (reward instanceof RandomObjectsReward) {
                              reward.objects.forEach((object, objectIndex) => {
                                if (scenario.ressources.some(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number)) {
                                  let i: number = scenario.ressources.findIndex(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number);
                                  reward.objects[objectIndex] = scenario.ressources[i];
                                } else {
                                  let i: number = role.ressources.findIndex(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number);
                                  reward.objects[objectIndex] = role.ressources[i];
                                }
                              });
                            }
                          });
                          return discussion;
                        });
                        role.sentences = role.sentences.map((sentenceData: any) => {
                          if (sentenceData.responses) {
                            return Object.assign(new InterrogativeSentence(sentenceData.ID), sentenceData);
                          } else {
                            return Object.assign(new DeclarativeSentence(sentenceData.ID), sentenceData);
                          }
                        });
                        role.sentences.forEach(sentence => {
                          sentence.rewards = sentence.rewards.map((rewardData: any) => {
                            if (rewardData.type == 'skill') {
                              return Object.assign(new SkillReward(), rewardData);
                            }
                            if (rewardData.type == 'character') {
                              return Object.assign(new CharacterReward(), rewardData);
                            }
                            if (rewardData.type == 'quest') {
                              return Object.assign(new QuestReward(), rewardData);
                            }
                            if (rewardData.type == 'object') {
                              return Object.assign(new ObjectReward(), rewardData);
                            }
                            if (rewardData.type == 'discussion') {
                              return Object.assign(new DiscussionReward(), rewardData);
                            }
                            if (rewardData.type == 'randomObjects') {
                              return Object.assign(new RandomObjectsReward(), rewardData);
                            }
                          });
                          sentence.rewards.forEach((reward: Reward, index: number) => {
                            if (reward instanceof SkillReward) {
                              let i: number = role.ressources.findIndex(element => element.type == 'attribut' && element.name == reward.skill.name && element.number == reward.skill.number);
                              reward.skill = role.ressources[i];
                            }
                            if (reward instanceof CharacterReward) {
                              let i: number = scenario.characters.findIndex(element => element.color == reward.character.color && element.description == reward.character.description && element.name == reward.character.name);
                              reward.character = scenario.characters[i];
                            }
                            if (reward instanceof ObjectReward) {
                              if (scenario.ressources.some(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number)) {
                                let i: number = scenario.ressources.findIndex(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number);
                                reward.object = scenario.ressources[i];
                              } else {
                                let i: number = role.ressources.findIndex(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number);
                                reward.object = role.ressources[i];
                              }
                            }
                            if (reward instanceof RandomObjectsReward) {
                              reward.objects.forEach((object, objectIndex) => {
                                if (scenario.ressources.some(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number)) {
                                  let i: number = scenario.ressources.findIndex(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number);
                                  reward.objects[objectIndex] = scenario.ressources[i];
                                } else {
                                  let i: number = role.ressources.findIndex(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number);
                                  reward.objects[objectIndex] = role.ressources[i];
                                }
                              });
                            }
                          });
                        });
                        role.responses = role.responses.map((responseData: any) => Object.assign(new Response(responseData.ID), responseData));
                        role.responses.forEach(response => {
                          response.rewards = response.rewards.map((rewardData: any) => {
                            if (rewardData.type == 'skill') {
                              return Object.assign(new SkillReward(), rewardData);
                            }
                            if (rewardData.type == 'character') {
                              return Object.assign(new CharacterReward(), rewardData);
                            }
                            if (rewardData.type == 'quest') {
                              return Object.assign(new QuestReward(), rewardData);
                            }
                            if (rewardData.type == 'object') {
                              return Object.assign(new ObjectReward(), rewardData);
                            }
                            if (rewardData.type == 'discussion') {
                              return Object.assign(new DiscussionReward(), rewardData);
                            }
                            if (rewardData.type == 'randomObjects') {
                              return Object.assign(new RandomObjectsReward(), rewardData);
                            }
                          });
                          response.rewards.forEach((reward: Reward, index: number) => {
                            if (reward instanceof SkillReward) {
                              let i: number = role.ressources.findIndex(element => element.type == 'attribut' && element.name == reward.skill.name && element.number == reward.skill.number);
                              reward.skill = role.ressources[i];
                            }
                            if (reward instanceof CharacterReward) {
                              let i: number = scenario.characters.findIndex(element => element.color == reward.character.color && element.description == reward.character.description && element.name == reward.character.name);
                              reward.character = scenario.characters[i];
                            }
                            if (reward instanceof ObjectReward) {
                              if (scenario.ressources.some(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number)) {
                                let i: number = scenario.ressources.findIndex(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number);
                                reward.object = scenario.ressources[i];
                              } else {
                                let i: number = role.ressources.findIndex(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number);
                                reward.object = role.ressources[i];
                              }
                            }
                            if (reward instanceof RandomObjectsReward) {
                              reward.objects.forEach((object, objectIndex) => {
                                if (scenario.ressources.some(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number)) {
                                  let i: number = scenario.ressources.findIndex(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number);
                                  reward.objects[objectIndex] = scenario.ressources[i];
                                } else {
                                  let i: number = role.ressources.findIndex(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number);
                                  reward.objects[objectIndex] = role.ressources[i];
                                }
                              });
                            }
                          });
                        });
          
                        role.tasks.forEach((inlineTasks: any[], index: number) => {
                          role.tasks[index] = inlineTasks.map((taskData: any) => {
                            if (taskData !== null) {
                              return Object.assign(new Task(taskData.type), taskData);
                            } else {
                              return null;
                            }
                          });
                          role.tasks[index].forEach(task => {
                            if (task instanceof Task) {
                              task.comments = task.comments.map((commentData: any) => Object.assign(new Comment(), commentData));
                              task.symbol = Object.assign(new Symbol(), task.symbol);
                              task.characters = task.characters.map((characterData: any) => Object.assign(new Character(), characterData));
                              task.characters.forEach((character, index) => {
                                let i: number | undefined = scenario.characters.findIndex(element => element.name == character.name && element.description == character.description && element.color == character.color);
                                if (typeof i !== 'undefined' && i !== -1) {
                                  task.characters[index] = scenario.characters[i];
                                }
                              });
                              if (task.supplementaryRole) {
                                task.supplementaryRole = Object.assign(new SupplementaryRole, task.supplementaryRole);
                                let supplementaryRoleIndex: number | undefined = role.supplementaryRoles.findIndex(element =>
                                  element.name == (task.supplementaryRole as SupplementaryRole).name && element.color == (task.supplementaryRole as SupplementaryRole).color
                                );
                                task.supplementaryRole = role.supplementaryRoles[supplementaryRoleIndex];
                              }
                              task.prerequireRessources = task.prerequireRessources.map((prerequireData: any) => Object.assign(new PrerequireRessource(), prerequireData));
                              task.prerequireRessources.forEach((prerequire, index) => {
                                if (scenario.ressources.some(element => element.name == prerequire.ressource.name && element.number == prerequire.ressource.number)) {
                                  let i: number = scenario.ressources.findIndex(element => element.name == prerequire.ressource.name && element.number == prerequire.ressource.number);
                                  prerequire.ressource = scenario.ressources[i];
                                } else {
                                  let i: number = role.ressources.findIndex(element => element.name == prerequire.ressource.name && element.number == prerequire.ressource.number);
                                  prerequire.ressource = role.ressources[i];
                                }
                              })
          
                              task.rewards = task.rewards.map((rewardData: any) => {
                                if (rewardData.type == 'skill') {
                                  return Object.assign(new SkillReward(), rewardData);
                                }
                                if (rewardData.type == 'character') {
                                  return Object.assign(new CharacterReward(), rewardData);
                                }
                                if (rewardData.type == 'object') {
                                  return Object.assign(new ObjectReward(), rewardData);
                                }
                                if (rewardData.type == 'randomObjects') {
                                  return Object.assign(new RandomObjectsReward(), rewardData);
                                }
                              });
                              task.rewards.forEach((reward: Reward, index: number) => {
                                if (reward instanceof SkillReward) {
                                  let i: number = role.ressources.findIndex(element => element.type == 'attribut' && element.name == reward.skill.name && element.number == reward.skill.number);
                                  reward.skill = role.ressources[i];
                                }
                                if (reward instanceof CharacterReward) {
                                  let i: number = scenario.characters.findIndex(element => element.color == reward.character.color && element.description == reward.character.description && element.name == reward.character.name);
                                  reward.character = scenario.characters[i];
                                }
                                if (reward instanceof ObjectReward) {
                                  if (scenario.ressources.some(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number)) {
                                    let i: number = scenario.ressources.findIndex(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number);
                                    reward.object = scenario.ressources[i];
                                  } else {
                                    let i: number = role.ressources.findIndex(element => element.name == reward.object.name && element.type == 'ressource' && element.number == reward.object.number);
                                    reward.object = role.ressources[i];
                                  }
                                }
                                if (reward instanceof RandomObjectsReward) {
                                  reward.objects.forEach((object, objectIndex) => {
                                    if (scenario.ressources.some(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number)) {
                                      let i: number = scenario.ressources.findIndex(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number);
                                      reward.objects[objectIndex] = scenario.ressources[i];
                                    } else {
                                      let i: number = role.ressources.findIndex(element => element.name == object?.name && element.type == 'ressource' && element.number == object?.number);
                                      reward.objects[objectIndex]  = role.ressources[i];
                                    }
                                  });
                                }
                              });
          
                              if ((task.typeUnity == 'getObject' || task.typeUnity == 'depositObject' || task.typeUnity == 'interactObject') && task.object) {
                                if (scenario.ressources.some(element => element.name == (task.object as Ressource).name && element.number == (task.object as Ressource).number && element.type == (task.object as Ressource).type)) {
                                  let i: number = scenario.ressources.findIndex(element => element.name == (task.object as Ressource).name && element.number == (task.object as Ressource).number && element.type == (task.object as Ressource).type);
                                  task.object = scenario.ressources[i];
                                } else {
                                  let i: number = role.ressources.findIndex(element => element.name == (task.object as Ressource).name && element.number == (task.object as Ressource).number && element.type == (task.object as Ressource).type);
                                  task.object = role.ressources[i];
                                }
                              }
                              if ((task.typeUnity == 'askTooSeeRole' || task.typeUnity == 'talkWithRole') && task.role) {
                                mission.roles.forEach(role => {
                                  if (role.intitule == task.role) {
                                    task.role == role.intitule;
                                  } 
                                });
                              }
                              if ((task.typeUnity == 'character' || task.typeUnity == 'exchangeObjects') && task.character) {
                                scenario.characters.forEach(character => {
                                  if (character.color == task.character?.color && character.description == task.character.description && character.name == task.character.name && character.tel == task.character.tel) {
                                    task.character = character;
                                  }
                                });
                              }
                              if ((task.typeUnity == 'combineObjects')) {
                                task.combineObjects.forEach((combineObject, index) => {
                                  if (combineObject[0] != null) {
                                    if (scenario.ressources.some(element => element.name == (combineObject[0] as Ressource).name && element.number == (combineObject[0] as Ressource).number && element.type == (combineObject[0] as Ressource).type)) {
                                      let i: number = scenario.ressources.findIndex(element => element.name == (combineObject[0] as Ressource).name && element.number == (combineObject[0] as Ressource).number && element.type == (combineObject[0] as Ressource).type);
                                      task.combineObjects[index][0] = scenario.ressources[i];
                                    } else {
                                      let i: number = role.ressources.findIndex(element => element.name == (combineObject[0] as Ressource).name && element.number == (combineObject[0] as Ressource).number && element.type == (combineObject[0] as Ressource).type);
                                      task.combineObjects[index][0] = role.ressources[i];
                                    }
                                  }
                                });
                              }
                              if ((task.typeUnity == 'exchangeObjects')) {
                                task.giveObjects.forEach((giveObject, index) => {
                                  if (giveObject[0] != null) {
                                    if (scenario.ressources.some(element => element.name == (giveObject[0] as Ressource).name && element.number == (giveObject[0] as Ressource).number && element.type == (giveObject[0] as Ressource).type)) {
                                      let i: number = scenario.ressources.findIndex(element => element.name == (giveObject[0] as Ressource).name && element.number == (giveObject[0] as Ressource).number && element.type == (giveObject[0] as Ressource).type);
                                      task.giveObjects[index][0] = scenario.ressources[i];
                                    } else {
                                      let i: number = role.ressources.findIndex(element => element.name == (giveObject[0] as Ressource).name && element.number == (giveObject[0] as Ressource).number && element.type == (giveObject[0] as Ressource).type);
                                      task.giveObjects[index][0] = role.ressources[i];
                                    }
                                  }
                                })
                                task.receiveObjects.forEach((receiveObject, index) => {
                                  if (receiveObject[0] != null) {
                                    if (scenario.ressources.some(element => element.name == (receiveObject[0] as Ressource).name && element.number == (receiveObject[0] as Ressource).number && element.type == (receiveObject[0] as Ressource).type)) {
                                      let i: number = scenario.ressources.findIndex(element => element.name == (receiveObject[0] as Ressource).name && element.number == (receiveObject[0] as Ressource).number && element.type == (receiveObject[0] as Ressource).type);
                                      task.receiveObjects[index][0] = scenario.ressources[i];
                                    } else {
                                      let i: number = role.ressources.findIndex(element => element.name == (receiveObject[0] as Ressource).name && element.number == (receiveObject[0] as Ressource).number && element.type == (receiveObject[0] as Ressource).type);
                                      task.receiveObjects[index][0] = role.ressources[i];
                                    }
                                  }
                                })
                              }
                            }
                          });
                        });
                      });
                    });
                    this.scenario = scenario;
                    this.pieceDetailsService.piece = this.scenario;
                    this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'import', undefined, undefined, 'all', 'Scenario'));
                    if (scenario.projectName) {
                      this.titleService.setTitle('RLG Maker - ' + this.scenario.projectName);
                    } else {
                      this.titleService.setTitle('RLG Maker');
                    }



                    this.cdr.detectChanges();
                    this._snackBar.open(this.translate.instant('snackbar_loading_success'), '', { duration: 5000, panelClass: 'snackbar-success' });
                  } catch (e) {
                    console.error(e);
                    this._snackBar.open(this.translate.instant('snackbar_loading_fail'), '', { duration: 5000, panelClass: 'snackbar-success' });
                  }

                })
              }
            });

          }).catch((error) => {
            console.error(error);
          });
        }
        
      }

      reader.readAsArrayBuffer(selectedFile);
    }
  }

  exportRoleToUnity(role: Role, roleIndex: number, missionIndex: number) {
    let exporter = new ExportUnity(this.scenario, role);
    let fileName: string = '';
    if (role.intitule) {
      fileName = role.intitule+' - '+this.translate.instant('siderTitle_mission')+' '+(missionIndex+1)+(this.scenario.projectName ? ' - '+this.scenario.projectName : '')+' - RLG Maker Export';
    } else {
      fileName = this.translate.instant('siderTitle_role')+' '+(roleIndex+1)+' - '+this.translate.instant('siderTitle_mission')+' '+(missionIndex+1)+(this.scenario.projectName ? ' - '+this.scenario.projectName : '')+' - RLG Maker Export';
    }
    try {
      const jsonString = exporter.exportRoleToUnity();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = fileName;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);        
    } catch (e: any) {
      this._snackBar.open(this.translate.instant('snackbar_unity_exportFailed'), '', { duration: 10000, panelClass: 'snackbar-fail' });
      console.error(e.name);
    }
     
  }

  zoomIn(): void {
    if (this.zoomService.zoom < 1.5) {
      const element = this.elementRef.nativeElement.querySelector('.container-appMouseWheelZoom');
      this.zoomService.zoom += 0.1;
      element.style.transform = `scale(${this.zoomService.zoom})`;
      this.minimapService.reset();
      if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase-1] && this.tutorialService.isActive && this.tutorialService.phase == 2) {
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'valid_phase', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
        this.tutorialService.validPhase();
      }
    }
  }

  zoomOut(): void {
    if (this.zoomService.zoom > 0.3) {
      const element = this.elementRef.nativeElement.querySelector('.container-appMouseWheelZoom');
      this.zoomService.zoom -= 0.1;
      element.style.transform = `scale(${this.zoomService.zoom})`;
      this.minimapService.reset();  
      if (!this.tutorialService.optionnalPhase && !this.tutorialService.phaseDone[this.tutorialService.phase-1] && this.tutorialService.isActive && this.tutorialService.phase == 2) {
        this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'valid_phase', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
        this.tutorialService.validPhase();
      }
    }
  }

  resetZoom(): void {
    this.zoomService.zoom = 1;
    this.minimapService.reset();
  }
  
  changeZoomLevel(event: any): void {
    this.zoomService.zoom = event.value;
    this.minimapService.reset();
  }

  getZoomPercentage(): number {
    return Math.fround(this.zoomService.zoom*100);
  }

  addMissionStep(mission: Mission, index: number, missionIndex: number): void {
    mission.addChronologieStep(index);
    mission.equalizeLengths();
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',missionIndex,undefined,'all','Step_m_['+index+']','#ACC9FC'));
  }

  addRoleStep(mission: Mission, role: Role, index: number, missionIndex: number, roleIndex: number): void {
    role.addChronologieStep(index);
    mission.equalizeLengths();
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',missionIndex,roleIndex,'all','Step_r_['+index+']','#ACC9FC'));
  }

  addTask(mission: Mission, role: Role, missionIndex: number, roleIndex: number, i: number, j: number, type: string) {
    if (type == 'optionnal') {
      let quantity: number;
      let minquantity: number;
      if (role.countOptionnalTasksInColumn(role.getRealIndex(i,j)) > 1) {
        minquantity = 1;
        quantity = 1;
      } else {
        minquantity = 2;
        quantity = 2;
      }
      const dialogRef = this.dialog.open(CreateOptionnalTaskDialogComponent, {
        data: { minquantity: minquantity, quantity: quantity, result: false },
      });
      dialogRef.afterClosed().subscribe(result => {
        quantity = (result as CreateOptionnalTaskDialogData).quantity;
        if ((result as CreateOptionnalTaskDialogData).result == true) {
          role.addOptionnalTask(i, j, type, quantity);
          this.cdr.detectChanges();
        }
      });
    } else {
      role.addTask(i, j, type);
    }
    switch(type) {
      case 'normal': this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',missionIndex,roleIndex,'all','Task_['+i+';'+j+']', '#B9DFE3')); break;
      case 'annexe': this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',missionIndex,roleIndex,'all','Side_task_['+i+';'+j+']', '#BCCECC')); break;
      case 'optionnal': this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',missionIndex,roleIndex,'all','Opt_task_['+i+';'+j+']', '#E8E3B3')); break;
      case 'final': this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',missionIndex,roleIndex,'all','Final_task_['+i+';'+j+']', '#B28386')); break;
      case 'event': this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',missionIndex,roleIndex,'all','Event_task_['+i+';'+j+']', '#BFDAA3')); break;
      case 'repeat': this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'new',missionIndex,roleIndex,'all','Repeat_task_['+i+';'+j+']', '#ABBCC6')); break;
    }
    mission.equalizeLengths();
  }

  dontContainFinalOrRepeatTask(tasks: (Task|null)[]): boolean {
    return !(tasks.some(task => task?.type == 'final') || tasks.some(task => task?.type == 'repeat'));
  }

  dontHaveTaskAfter(tasks: (Task|null)[], index: number): boolean {
    return !tasks.slice(index, tasks.length).some(task => task instanceof Task);
  }

  canCreateFinalOrRepeatTask(tasks: (Task|null)[], index: number): boolean {
    let res: boolean = false;
    if (this.dontContainFinalOrRepeatTask(tasks) && this.dontHaveTaskAfter(tasks, index)) {
      res = true;
    }
    return res;
  }

  getSiderTitle(): string {
    let piece = this.pieceDetailsService.piece;
    if (piece instanceof Task) {
      return this.translate.instant('siderTitle_mission') + ' ' + ((this.pieceDetailsService.missionIndex as number) + 1)
        + ' / ' + (this.pieceDetailsService.parentAsRole().intitule == ''
        ? (this.translate.instant('siderTitle_role') + ' ' + ((this.pieceDetailsService.roleIndex as number) + 1))
        : this.pieceDetailsService.parentAsRole().intitule)
        + '\n' + this.translate.instant('siderTitle_task') + ' [' 
        + ((this.pieceDetailsService.pieceIndex as number[])[0] + 1) + ';'
        + ((this.pieceDetailsService.parent as Role).getRealIndex(((this.pieceDetailsService.pieceIndex as number[])[0]), (this.pieceDetailsService.pieceIndex as number[])[1]) + 1) + ']';
    }
    if (piece instanceof Role) {
      return this.translate.instant('siderTitle_mission') + ' ' + ((this.pieceDetailsService.missionIndex as number) + 1)
        + ' / ' + (piece.intitule == ''
        ? (this.translate.instant('siderTitle_role') + ' ' + ((this.pieceDetailsService.roleIndex as number) + 1))
        : piece.intitule)
    }
    if (piece instanceof Mission) {
      return this.translate.instant('siderTitle_mission') + ' ' + ((this.pieceDetailsService.missionIndex as number) + 1)
    }
    if (piece instanceof Scenario) {
      return this.translate.instant('siderTitle_game');
    }
    if (piece instanceof Step) {
      if (this.pieceDetailsService.parent instanceof Mission) {
        return this.translate.instant('siderTitle_mission') + ' ' + ((this.pieceDetailsService.missionIndex as number) + 1)
        + ' / ' + this.translate.instant('siderTitle_step') + ' ' + (this.getStepNumber((this.pieceDetailsService.parent as Mission), (this.pieceDetailsService.pieceIndex as number)));
      } else {
        return this.translate.instant('siderTitle_mission') + ' ' + ((this.pieceDetailsService.missionIndex as number) + 1)
        + ' / ' + (this.pieceDetailsService.parentAsRole().intitule == ''
        ? (this.translate.instant('siderTitle_role') + ' ' + ((this.pieceDetailsService.roleIndex as number) + 1))
        : this.pieceDetailsService.parentAsRole().intitule)
        + '\n' + this.translate.instant('siderTitle_step') + ' ' + (this.getStepNumber((this.pieceDetailsService.parent as Role), (this.pieceDetailsService.pieceIndex as number)));
      }
    } else {
      return '';
    }
  }

  getStepNumber(parent: Mission | Role, index: number): number {
    let number: number = 1;
    for(let i = 0; i < index; i++) {
      if (parent.chronologie[i] instanceof Step) {
        number++;
      }
    }
    return number;
  }

  tooltipsTrace(event: any) {
    if(event.target.checked) {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'enable_tooltips',undefined, undefined,'all','Scenario'));
    } else {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'disable_tooltips',undefined, undefined,'all','Scenario'));
    }
  }

  unityTrace(event: any) {
    if(event.target.checked) {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'enable_unity',undefined, undefined,'all','Scenario'));
    } else {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length,'disable_unity',undefined, undefined,'all','Scenario'));
    }
  }

  resumeTutorialTrace() {
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'resume_tutorial', undefined, undefined, 'phase_'+this.tutorialService.phase, 'Tutorial'));
  }

  verifyIfAllDurationUnitAreSame(): boolean {
    let res = true;
    let durationUnit: string;
    this.scenario.missions.forEach(mission => {
      mission.roles.forEach(role => {
        for (let i = 0; i < role.tasks.length; i++) {
          for (let j = 0; j < role.tasks[i].length; j++) {
            let task: Task|null = role.tasks[i][j];
            if (task instanceof Task) {
              if (durationUnit) {
                if (durationUnit != task.durationUnit) {
                  res = false;
                }
              } else {
                durationUnit = task.durationUnit;
              }
            }
          }
        }
      });
    });
    return res;
  }

  verifyGame(): void {
    if (this.verifyIfAllDurationUnitAreSame()) {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'verify_scenario', undefined, undefined, undefined, 'Scenario'));
      const dialogRef = this.dialog.open(VerifyDialogComponent, {
        data: this.scenario
      });
    } else {
      this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'failed_verify_scenario', undefined, undefined, undefined, 'Scenario'));
      this._snackBar.open(this.translate.instant('verify_error'), '', { duration: 10000, panelClass: 'snackbar-fail' });
    }
  }

  consultLegals(): void {
    this.tracesService.traces.push(new Trace(this.tracesService.traces.length, 'consult_legals'));
    const dialogRef = this.dialog.open(LegalDialogComponent, {
      maxWidth: '50vw',
    });
  }
}

export interface CreateOptionnalTaskDialogData {
  quantity: number;
  minquantity: number;
  result: boolean;
}