import { Discussion } from "../discussion/discussion";
import { CharacterReward } from "../rewards/character-reward/character-reward";
import { DiscussionReward } from "../rewards/discussion-reward/discussion-reward";
import { ObjectReward } from "../rewards/object-reward/object-reward";
import { QuestReward } from "../rewards/quest-reward/quest-reward";
import { SkillReward } from "../rewards/skill-reward/skill-reward";
import { Role } from "../role/role";
import { Scenario } from "../scenario/scenario";
import { DeclarativeSentence } from "../sentence/declarativeSentence/declarative-sentence";
import { InterrogativeSentence } from "../sentence/interrogativeSentence/interrogative-sentence";
import { Task } from "../task/task";

export class ExportUnity {

    private scenario: Scenario;
    private role: Role;
    private exportedRole: UnityRole = {
        Character: [],
        Discussion: [],
        InterrogativeSentence: [],
        DeclarativeSentence: [],
        Response: [],
        Quests: [],
        SpeakToTask: [],
        GetObjectTasks: [],
        InteractWithTask: [],
        BeginQuestResult: [],
        ChangeDiscussionResult: [],
        GetObjectResult: [],
        GetPhoneNumberResult: [],
        AddCharacterKnowledgementResult: [],
        EarnSkillResult: [],
        SkillCategory: [],
        Skill: [],
        Item: []
    }

    private characterID: number = 0;
    private resultID: number = 0;
    private itemID: number = 0;
    private skillID: number = 0;
    private questID: number = 0;
    private taskID: number = 0;

    constructor(scenario: Scenario, role: Role) {
        this.scenario = scenario;
        this.role = role;
    }

    public exportRoleToUnity(): string {
        this.exportedRole.Character = this.getCharacters();
        this.exportedRole.SkillCategory = this.getSkillCategories();
        this.exportedRole.Skill = this.getSkills();
        this.exportedRole.Item = this.getItems();
        this.exportedRole.Quests = this.getQuests();

        this.exportedRole.GetPhoneNumberResult = this.getGetPhoneNumberResults();
        this.exportedRole.GetObjectResult = this.getGetObjectResults();
        this.exportedRole.EarnSkillResult = this.getEarnSkillResults();
        this.exportedRole.ChangeDiscussionResult = this.getChangeDiscussionResults();
        this.exportedRole.BeginQuestResult = this.getBeginQuestResults();

        this.exportedRole.Discussion = this.getDiscussions();
        this.exportedRole.InterrogativeSentence = this.getInterrogativeSentences();
        this.exportedRole.DeclarativeSentence = this.getDeclarativeSentences();
        this.exportedRole.Response = this.getResponses();

        this.exportedRole.SpeakToTask = this.getSpeakToTasks();
        this.exportedRole.InteractWithTask = this.getInteractWithTasks();
        this.exportedRole.GetObjectTasks = this.getGetObjectTasks();
        this.affectRequiredTasks();

        return JSON.stringify(this.exportedRole,undefined,2);
    }

    private getCharacters(): UnityCharacter[] {
        let characters: UnityCharacter[] = [];
        
        this.role.discussions.forEach(discussion => {
            if (!characters.some(char => discussion.character.name == char.name && discussion.character.tel == char.phone)) {
                let char: UnityCharacter = {
                    name: discussion.character.name,
                    ID: this.characterID++,
                    discussionID: [],
                    currentDiscussionID: undefined,
                    phone: discussion.character.tel
                };
                characters.push(char);
            }
        });

        this.role.rewards.forEach(reward => {
            if (reward instanceof CharacterReward) {
                if (reward.character.reachableByPhone) {
                    if (!characters.some(char => reward.character.name == char.name && reward.character.tel == char.phone)) {
                        let char: UnityCharacter = {
                            name: reward.character.name,
                            ID: this.characterID++,
                            discussionID: [],
                            currentDiscussionID: undefined,
                            phone: reward.character.tel
                        };
                        characters.push(char);
                    }                    
                }
            }
        });

        this.role.tasks.forEach(inlineTask => {
            inlineTask.forEach(task => {
                if (task instanceof Task) {
                    if (task.character) {
                        if (!characters.some(char => task.character?.name == char.name && task.character.tel == char.phone)) {
                            let char: UnityCharacter = {
                                name: task.character.name,
                                ID: this.characterID++,
                                discussionID: [],
                                currentDiscussionID: undefined,
                                phone: task.character.tel
                            };
                            characters.push(char);
                        }
                    }
                    task.rewards.forEach(reward => {
                        if (reward instanceof CharacterReward) {
                            if (reward.character.reachableByPhone) {
                                if (!characters.some(char => reward.character.name == char.name && reward.character.tel == char.phone)) {
                                    let char: UnityCharacter = {
                                        name: reward.character.name,
                                        ID: this.characterID++,
                                        discussionID: [],
                                        currentDiscussionID: undefined,
                                        phone: reward.character.tel
                                    };
                                    characters.push(char);
                                }                                
                            }
                        }
                    });
                }
            });
        });

        this.role.discussions.forEach(discussion => {
            discussion.rewards.forEach(reward => {
                if (reward instanceof CharacterReward) {
                    if (reward.character.reachableByPhone) {
                        if (!characters.some(char => reward.character.name == char.name && reward.character.tel == char.phone)) {
                            let char: UnityCharacter = {
                                name: reward.character.name,
                                ID: this.characterID++,
                                discussionID: [],
                                currentDiscussionID: undefined,
                                phone: reward.character.tel
                            };
                            characters.push(char);
                        }                        
                    }
                }
            });
        });

        this.role.sentences.forEach(sentence => {
            sentence.rewards.forEach(reward => {
                if (reward instanceof CharacterReward) {
                    if (reward.character.reachableByPhone) {
                        if (!characters.some(char => reward.character.name == char.name && reward.character.tel == char.phone)) {
                            let char: UnityCharacter = {
                                name: reward.character.name,
                                ID: this.characterID++,
                                discussionID: [],
                                currentDiscussionID: undefined,
                                phone: reward.character.tel
                            };
                            characters.push(char);
                        }                        
                    }
                }
            });
        });

        this.role.responses.forEach(response => {
            response.rewards.forEach(reward => {
                if (reward instanceof CharacterReward) {
                    if (reward.character.reachableByPhone) {
                        if (!characters.some(char => reward.character.name == char.name && reward.character.tel == char.phone)) {
                            let char: UnityCharacter = {
                                name: reward.character.name,
                                ID: this.characterID++,
                                discussionID: [],
                                currentDiscussionID: undefined,
                                phone: reward.character.tel
                            };
                            characters.push(char);
                        }                        
                    }
                }
            });
        });
        
        return characters;
    }

    private getDiscussions(): UnityDiscussion[] {
        let discussions: UnityDiscussion[] = [];
        this.role.discussions.forEach(discuss => {
            let character: UnityCharacter = this.exportedRole.Character.find(char => char.name == discuss.character.name && char.phone == discuss.character.tel) as UnityCharacter;
            let results: number[] = [];
            discuss.rewards.forEach(reward => {
                if (reward instanceof QuestReward) {
                    let resultID: number = (this.exportedRole.BeginQuestResult.find(result => result.name == 'Débloquer la quête : '+reward.questName) as UnityBeginQuestResult).ID;
                    results.push(resultID);
                }
                if (reward instanceof SkillReward) {
                    let resultID: number = (this.exportedRole.EarnSkillResult.find(result => 'Compétence acquise : '+reward.skill.name == result.name) as UnityEarnSkillResult).ID;
                    results.push(resultID);
                }
                if (reward instanceof CharacterReward) {
                    if (reward.character.reachableByPhone) {
                        let resultID: number = (this.exportedRole.GetPhoneNumberResult.find(result => 'Récupérer le numéro de '+reward.character.name == result.name) as UnityGetPhoneNumberResult).ID;
                        results.push(resultID);                        
                    }
                }
                if (reward instanceof ObjectReward) {
                    let resultID: number = (this.exportedRole.GetObjectResult.find(result => 'Objet reçu : '+reward.object.name == result.name && reward.quantity == result.quantity) as UnityGetObjectResult).ID;
                    results.push(resultID);
                }
                if (reward instanceof DiscussionReward) {
                    let resultID: number = (this.exportedRole.ChangeDiscussionResult.find(result => result.discussionID == reward.discussionId) as UnityChangeDiscussionResult).ID;
                    results.push(resultID);
                }
            });
            character.discussionID.push(discuss.ID);
            if (discuss.isFirstDiscussion) {
                character.currentDiscussionID = discuss.ID;
            }
            let discussion: UnityDiscussion = {
                ID: discuss.ID,
                name: discuss.name,
                sentenceID: discuss.sentences,
                resultID: results,
                firstSentence: discuss.firstSentenceID,
                characterID: character.ID
            };
            discussions.push(discussion);
        });

        return discussions;
    }

    private getInterrogativeSentences(): UnityInterrogativeSentence[] {
        let sentences: UnityInterrogativeSentence[] = [];

        this.role.sentences.forEach(sentence => {
            if (sentence instanceof InterrogativeSentence) {
                let results: number[] = [];
                sentence.rewards.forEach(reward => {
                    if (reward instanceof QuestReward) {
                        let resultID: number = (this.exportedRole.BeginQuestResult.find(result => result.name == 'Débloquer la quête : '+reward.questName) as UnityBeginQuestResult).ID;
                        results.push(resultID);
                    }
                    if (reward instanceof SkillReward) {
                        let resultID: number = (this.exportedRole.EarnSkillResult.find(result => 'Compétence acquise : '+reward.skill.name == result.name) as UnityEarnSkillResult).ID;
                        results.push(resultID);
                    }
                    if (reward instanceof CharacterReward) {
                        if (reward.character.reachableByPhone) {
                            let resultID: number = (this.exportedRole.GetPhoneNumberResult.find(result => 'Récupérer le numéro de '+reward.character.name == result.name) as UnityGetPhoneNumberResult).ID;
                            results.push(resultID);                            
                        }
                    }
                    if (reward instanceof ObjectReward) {
                        let resultID: number = (this.exportedRole.GetObjectResult.find(result => 'Objet reçu : '+reward.object.name == result.name && reward.quantity == result.quantity) as UnityGetObjectResult).ID;
                        results.push(resultID);
                    }
                    if (reward instanceof DiscussionReward) {
                        let resultID: number = (this.exportedRole.ChangeDiscussionResult.find(result => result.discussionID == reward.discussionId) as UnityChangeDiscussionResult).ID;
                        results.push(resultID);
                    }
                });
                let interrogativeSentence: UnityInterrogativeSentence = {
                    ID: sentence.ID,
                    value: sentence.value,
                    resultID: results,
                    idDiscussion: sentence.idDiscussion,
                    responseID: sentence.responses
                }
                sentences.push(interrogativeSentence);
            }
        });

        return sentences;
    }

    private getDeclarativeSentences(): UnityDeclarativeSentence[] {
        let sentences: UnityDeclarativeSentence[] = [];

        this.role.sentences.forEach(sentence => {
            if (sentence instanceof DeclarativeSentence) {
                let results: number[] = [];
                sentence.rewards.forEach(reward => {
                    if (reward instanceof QuestReward) {
                        let resultID: number = (this.exportedRole.BeginQuestResult.find(result => result.name == 'Débloquer la quête : '+reward.questName) as UnityBeginQuestResult).ID;
                        results.push(resultID);
                    }
                    if (reward instanceof SkillReward) {
                        let resultID: number = (this.exportedRole.EarnSkillResult.find(result => 'Compétence acquise : '+reward.skill.name == result.name) as UnityEarnSkillResult).ID;
                        results.push(resultID);
                    }
                    if (reward instanceof CharacterReward) {
                        if (reward.character.reachableByPhone) {
                            let resultID: number = (this.exportedRole.GetPhoneNumberResult.find(result => 'Récupérer le numéro de '+reward.character.name == result.name) as UnityGetPhoneNumberResult).ID;
                            results.push(resultID);                            
                        }
                    }
                    if (reward instanceof ObjectReward) {
                        let resultID: number = (this.exportedRole.GetObjectResult.find(result => 'Objet reçu : '+reward.object.name == result.name && reward.quantity == result.quantity) as UnityGetObjectResult).ID;
                        results.push(resultID);
                    }
                    if (reward instanceof DiscussionReward) {
                        let resultID: number = (this.exportedRole.ChangeDiscussionResult.find(result => result.discussionID == reward.discussionId) as UnityChangeDiscussionResult).ID;
                        results.push(resultID);
                    }
                });
                let interrogativeSentence: UnityDeclarativeSentence = {
                    ID: sentence.ID,
                    value: sentence.value,
                    resultID: results,
                    idDiscussion: sentence.idDiscussion,
                    nextSentence: sentence.nextSentence
                }
                sentences.push(interrogativeSentence);
            }
        });

        return sentences;
    }

    private getResponses(): UnityResponse[] {
        let responses: UnityResponse[] = [];

        this.role.responses.forEach(resp => {
            let results: number[] = [];
            resp.rewards.forEach(reward => {
                if (reward instanceof QuestReward) {
                    let resultID: number = (this.exportedRole.BeginQuestResult.find(result => result.name == 'Débloquer la quête : '+reward.questName) as UnityBeginQuestResult).ID;
                    results.push(resultID);
                }
                if (reward instanceof SkillReward) {
                    let resultID: number = (this.exportedRole.EarnSkillResult.find(result => 'Compétence acquise : '+reward.skill.name == result.name) as UnityEarnSkillResult).ID;
                    results.push(resultID);
                }
                if (reward instanceof CharacterReward) {
                    if (reward.character.reachableByPhone) {
                        let resultID: number = (this.exportedRole.GetPhoneNumberResult.find(result => 'Récupérer le numéro de '+reward.character.name == result.name) as UnityGetPhoneNumberResult).ID;
                        results.push(resultID);                        
                    }
                }
                if (reward instanceof ObjectReward) {
                    let resultID: number = (this.exportedRole.GetObjectResult.find(result => 'Objet reçu : '+reward.object.name == result.name && reward.quantity == result.quantity) as UnityGetObjectResult).ID;
                    results.push(resultID);
                }
                if (reward instanceof DiscussionReward) {
                    let resultID: number = (this.exportedRole.ChangeDiscussionResult.find(result => result.discussionID == reward.discussionId) as UnityChangeDiscussionResult).ID;
                    results.push(resultID);
                }
            });
            let response: UnityResponse = {
                ID: resp.ID,
                value: resp.value,
                nextSentence: resp.nextSentence,
                resultID: results,
                idInterrogativeSentence: resp.idInterrogativeSentence
            };
            responses.push(response);
            
        });

        return responses;
    }

    private getQuests(): UnityQuest[] {
        let quests: UnityQuest[] = [];

        quests[0] = {
            ID: this.questID++,
            name: this.role.questName,
            description: this.role.description,
            taskID: [],
            resultID: [],
            requiredQuestID: []
        }

        this.scenario.missions.forEach(mission => {
            mission.roles.forEach(role => {
                if (role.intitule == this.role.intitule && role.questName != this.role.questName) {
                    let quest: UnityQuest = {
                        ID: this.questID,
                        name: role.questName,
                        description: role.description,
                        taskID: [],
                        resultID: [],
                        requiredQuestID: []
                    };
                    quests.push(quest);
                }
            });
        });

        return quests;
    }

    private getSpeakToTasks(): UnitySpeakToTask[] {
        let tasks: UnitySpeakToTask[] = [];

        this.role.tasks.forEach(inlineTask => {
            inlineTask.forEach(task => {
                if (task instanceof Task && task.type == 'normal' && task.typeUnity == 'character') {
                    let taskID: number = this.taskID++;
                    this.exportedRole.Quests[0].taskID.push(taskID);

                    let character: UnityCharacter = this.exportedRole.Character.find(char => char.name == task.character?.name && char.phone == task.character?.tel) as UnityCharacter;
                    
                    let results: number[] = [];
                    task.rewards.forEach(reward => {
                        if (reward instanceof QuestReward) {
                            let resultID: number = (this.exportedRole.BeginQuestResult.find(result => result.name == 'Débloquer la quête : '+reward.questName) as UnityBeginQuestResult).ID;
                            results.push(resultID);
                        }
                        if (reward instanceof SkillReward) {
                            let resultID: number = (this.exportedRole.EarnSkillResult.find(result => 'Compétence acquise : '+reward.skill.name == result.name) as UnityEarnSkillResult).ID;
                            results.push(resultID);
                        }
                        if (reward instanceof CharacterReward) {
                            if (reward.character.reachableByPhone) {
                                let resultID: number = (this.exportedRole.GetPhoneNumberResult.find(result => 'Récupérer le numéro de '+reward.character.name == result.name) as UnityGetPhoneNumberResult).ID;
                                results.push(resultID);                                
                            }
                        }
                        if (reward instanceof ObjectReward) {
                            let resultID: number = (this.exportedRole.GetObjectResult.find(result => 'Objet reçu : '+reward.object.name == result.name && reward.quantity == result.quantity) as UnityGetObjectResult).ID;
                            results.push(resultID);
                        }
                        if (reward instanceof DiscussionReward) {
                            let resultID: number = (this.exportedRole.ChangeDiscussionResult.find(result => result.discussionID == reward.discussionId) as UnityChangeDiscussionResult).ID;
                            results.push(resultID);
                        }
                    });

                    let taskUnity: UnitySpeakToTask = {
                        ID: taskID,
                        name: task.name,
                        questID: 0,
                        description: task.objective,
                        requiredTaskID: [],
                        resultID: results,
                        characterID: character.ID
                    }
                    tasks.push(taskUnity);
                }
            });
        });

        return tasks;
    }

    private getGetObjectTasks(): UnityGetObjectTask[] {
        let tasks: UnityGetObjectTask[] = [];

        this.role.tasks.forEach(inlineTask => {
            inlineTask.forEach(task => {
                if (task instanceof Task && task.type == 'normal' && task.typeUnity == 'getObject') {
                    let taskID: number = this.taskID++;
                    this.exportedRole.Quests[0].taskID.push(taskID);

                    let object: UnityItem = this.exportedRole.Item.find(item => item.name == task.object?.name) as UnityItem;
                    
                    let results: number[] = [];
                    task.rewards.forEach(reward => {
                        if (reward instanceof QuestReward) {
                            let resultID: number = (this.exportedRole.BeginQuestResult.find(result => result.name == 'Débloquer la quête : '+reward.questName) as UnityBeginQuestResult).ID;
                            results.push(resultID);
                        }
                        if (reward instanceof SkillReward) {
                            let resultID: number = (this.exportedRole.EarnSkillResult.find(result => 'Compétence acquise : '+reward.skill.name == result.name) as UnityEarnSkillResult).ID;
                            results.push(resultID);
                        }
                        if (reward instanceof CharacterReward) {
                            if (reward.character.reachableByPhone) {
                                let resultID: number = (this.exportedRole.GetPhoneNumberResult.find(result => 'Récupérer le numéro de '+reward.character.name == result.name) as UnityGetPhoneNumberResult).ID;
                                results.push(resultID);                                
                            }
                        }
                        if (reward instanceof ObjectReward) {
                            let resultID: number = (this.exportedRole.GetObjectResult.find(result => 'Objet reçu : '+reward.object.name == result.name && reward.quantity == result.quantity) as UnityGetObjectResult).ID;
                            results.push(resultID);
                        }
                        if (reward instanceof DiscussionReward) {
                            let resultID: number = (this.exportedRole.ChangeDiscussionResult.find(result => result.discussionID == reward.discussionId) as UnityChangeDiscussionResult).ID;
                            results.push(resultID);
                        }
                    });

                    let taskUnity: UnityGetObjectTask = {
                        ID: taskID,
                        name: task.name,
                        questID: 0,
                        description: task.objective,
                        requiredTaskID: [],
                        resultID: results,
                        objectID: object.ID,
                        quantity: task.objectQuantity
                    }
                    tasks.push(taskUnity);
                }
            });
        });

        return tasks;
    }

    private getInteractWithTasks(): UnityInteractWithTask[] {
        let tasks: UnityInteractWithTask[] = [];

        this.role.tasks.forEach(inlineTask => {
            inlineTask.forEach(task => {
                if (task instanceof Task && task.type == 'normal' && task.typeUnity == 'interactObject') {
                    let taskID: number = this.taskID++;
                    this.exportedRole.Quests[0].taskID.push(taskID);

                    let object: UnityItem = this.exportedRole.Item.find(item => item.name == task.object?.name) as UnityItem;
                    
                    let results: number[] = [];
                    task.rewards.forEach(reward => {
                        if (reward instanceof QuestReward) {
                            let resultID: number = (this.exportedRole.BeginQuestResult.find(result => result.name == 'Débloquer la quête : '+reward.questName) as UnityBeginQuestResult).ID;
                            results.push(resultID);
                        }
                        if (reward instanceof SkillReward) {
                            let resultID: number = (this.exportedRole.EarnSkillResult.find(result => 'Compétence acquise : '+reward.skill.name == result.name) as UnityEarnSkillResult).ID;
                            results.push(resultID);
                        }
                        if (reward instanceof CharacterReward) {
                            if (reward.character.reachableByPhone) {
                                let resultID: number = (this.exportedRole.GetPhoneNumberResult.find(result => 'Récupérer le numéro de '+reward.character.name == result.name) as UnityGetPhoneNumberResult).ID;
                                results.push(resultID);                                
                            }
                        }
                        if (reward instanceof ObjectReward) {
                            let resultID: number = (this.exportedRole.GetObjectResult.find(result => 'Objet reçu : '+reward.object.name == result.name && reward.quantity == result.quantity) as UnityGetObjectResult).ID;
                            results.push(resultID);
                        }
                        if (reward instanceof DiscussionReward) {
                            let resultID: number = (this.exportedRole.ChangeDiscussionResult.find(result => result.discussionID == reward.discussionId) as UnityChangeDiscussionResult).ID;
                            results.push(resultID);
                        }
                    });

                    let taskUnity: UnityInteractWithTask = {
                        ID: taskID,
                        name: task.name,
                        questID: 0,
                        description: task.objective,
                        requiredTaskID: [],
                        resultID: results,
                        objectID: object.ID
                    }
                    tasks.push(taskUnity);
                }
            });
        });

        return tasks;
    }

    private affectRequiredTasks(): void {

        this.role.tasks.forEach(inlineTasks => {
            inlineTasks.forEach(task => {
                if (task instanceof Task && task.type == 'normal') {
                    let unityRelatedTask = this.getRelatedUnityTask(task);
                    task.prerequireTasks.forEach(antecedent => {
                        let identifierRelatedTask: Task = this.getIdentifierRelatedTask(antecedent.identifier);
                        unityRelatedTask.requiredTaskID = unityRelatedTask.requiredTaskID.concat(this.getRequiredTasks(identifierRelatedTask));                     
                    });          
                }
            });
        });

    }

    private getRelatedUnityTask(task: Task): UnitySpeakToTask | UnityGetObjectTask | UnityInteractWithTask {
        if (task.typeUnity === 'character') {
            let foundTask = this.exportedRole.SpeakToTask.find(tsk => tsk.name === task.name && tsk.description === task.objective);
            if (foundTask) {
                return foundTask as UnitySpeakToTask;
            }
        } 
        if (task.typeUnity === 'getObject') {
            let foundTask = this.exportedRole.GetObjectTasks.find(tsk => tsk.name === task.name && tsk.description === task.objective);
            if (foundTask) {
                return foundTask as UnityGetObjectTask;
            }
        } 
        if (task.typeUnity === 'interactObject') {
            let foundTask = this.exportedRole.InteractWithTask.find(tsk => tsk.name === task.name && tsk.description === task.objective);
            if (foundTask) {
                return foundTask as UnityInteractWithTask;
            }
        }
        throw new Error('Unknown typeUnity '+task.typeUnity);
    }
    
    private getIdentifierRelatedTask(identifier: string): Task {
        let relatedTask: Task = new Task('normal');
        this.role.tasks.forEach(inlineTask => {
            inlineTask.forEach(task => {
                if (task instanceof Task) {
                    if (task.identifier == identifier) {
                        relatedTask = task;
                    }                    
                }
            });
        });
        return relatedTask;
    }

    private getRequiredTasks(task: Task): number[] {
        let antecedents: number[] = [];

        if (task.type == 'normal') {
            let antecedentID = this.getRelatedUnityTask(task).ID;
            if (antecedentID != undefined) {
                antecedents.push(antecedentID);
            }
        } else {
            task.prerequireTasks.forEach(antecedent => {
                let identifierRelatedTask: Task = this.getIdentifierRelatedTask(antecedent.identifier);
                antecedents = antecedents.concat(this.getRequiredTasks(identifierRelatedTask));
            });
        }

        return antecedents;
    }

    private getBeginQuestResults(): UnityBeginQuestResult[] {
        let results: UnityBeginQuestResult[] = [];

        this.role.rewards.forEach(reward => {
            if (reward instanceof QuestReward) {
                let quest: UnityQuest = this.exportedRole.Quests.find(qst => qst.name == reward.questName) as UnityQuest;
                if (!results.some(element => element.questID == quest.ID)) {
                    let result: UnityBeginQuestResult = {
                        ID: this.resultID++,
                        name: 'Débloquer la quête : '+reward.questName,
                        questID: quest.ID
                    };
                    results.push(result);
                }
            }
        });

        this.role.tasks.forEach(inlineTasks => {
            inlineTasks.forEach(task => {
                if (task instanceof Task) {
                    task.rewards.forEach(reward => {
                        if (reward instanceof QuestReward) {
                            let quest: UnityQuest = this.exportedRole.Quests.find(qst => qst.name == reward.questName) as UnityQuest;
                            if (!results.some(element => element.questID == quest.ID)) {
                                let result: UnityBeginQuestResult = {
                                    ID: this.resultID++,
                                    name: 'Débloquer la quête : '+reward.questName,
                                    questID: quest.ID
                                };
                                results.push(result);
                            }
                        }
                    });
                }
            });
        });

        this.role.discussions.forEach(discussion => {
            discussion.rewards.forEach(reward => {
                if (reward instanceof QuestReward) {
                    let quest: UnityQuest = this.exportedRole.Quests.find(qst => qst.name == reward.questName) as UnityQuest;
                    if (!results.some(element => element.questID == quest.ID)) {
                        let result: UnityBeginQuestResult = {
                            ID: this.resultID++,
                            name: 'Débloquer la quête : '+reward.questName,
                            questID: quest.ID
                        };
                        results.push(result);
                    }
                }
            });
        });

        this.role.sentences.forEach(sentence => {
            sentence.rewards.forEach(reward => {
                if (reward instanceof QuestReward) {
                    let quest: UnityQuest = this.exportedRole.Quests.find(qst => qst.name == reward.questName) as UnityQuest;
                    if (!results.some(element => element.questID == quest.ID)) {
                        let result: UnityBeginQuestResult = {
                            ID: this.resultID++,
                            name: 'Débloquer la quête : '+reward.questName,
                            questID: quest.ID
                        };
                        results.push(result);
                    }
                }
            });
        });

        this.role.responses.forEach(response => {
            response.rewards.forEach(reward => {
                if (reward instanceof QuestReward) {
                    let quest: UnityQuest = this.exportedRole.Quests.find(qst => qst.name == reward.questName) as UnityQuest;
                    if (!results.some(element => element.questID == quest.ID)) {
                        let result: UnityBeginQuestResult = {
                            ID: this.resultID++,
                            name: 'Débloquer la quête : '+reward.questName,
                            questID: quest.ID
                        };
                        results.push(result);
                    }
                }
            });
        });


        return results;
    }

    private getChangeDiscussionResults(): UnityChangeDiscussionResult[] {
        let results: UnityChangeDiscussionResult[] = [];

        this.role.rewards.forEach(reward => {
            if (reward instanceof DiscussionReward) {
                let discussion: Discussion = this.role.discussions.find(discuss => discuss.ID == reward.discussionId) as Discussion;
                let character: UnityCharacter = this.exportedRole.Character.find(char => char.name == discussion.character.name && char.phone == discussion.character.tel) as UnityCharacter;
                if (!results.some(element => element.characterID == character.ID && element.discussionID == discussion.ID)) {
                    let result: UnityChangeDiscussionResult = {
                        ID: this.resultID++,
                        name: 'Changer la conversation de '+character.name+' en '+discussion.name,
                        characterID: character.ID,
                        discussionID: discussion.ID
                    };
                    results.push(result);                    
                }
            }
        });

        this.role.discussions.forEach(discussion => {
            discussion.rewards.forEach(reward => {
                if (reward instanceof DiscussionReward) {
                    let discussion: Discussion = this.role.discussions.find(discuss => discuss.ID == reward.discussionId) as Discussion;
                    let character: UnityCharacter = this.exportedRole.Character.find(char => char.name == discussion.character.name && char.phone == discussion.character.tel) as UnityCharacter;
                    if (!results.some(element => element.characterID == character.ID && element.discussionID == discussion.ID)) {
                        let result: UnityChangeDiscussionResult = {
                            ID: this.resultID++,
                            name: 'Changer la conversation de '+character.name+' en '+discussion.name,
                            characterID: character.ID,
                            discussionID: discussion.ID
                        };
                        results.push(result);                    
                    }
                }
            });
        });

        this.role.sentences.forEach(sentence => {
            sentence.rewards.forEach(reward => {
                if (reward instanceof DiscussionReward) {
                    let discussion: Discussion = this.role.discussions.find(discuss => discuss.ID == reward.discussionId) as Discussion;
                    let character: UnityCharacter = this.exportedRole.Character.find(char => char.name == discussion.character.name && char.phone == discussion.character.tel) as UnityCharacter;
                    if (!results.some(element => element.characterID == character.ID && element.discussionID == discussion.ID)) {
                        let result: UnityChangeDiscussionResult = {
                            ID: this.resultID++,
                            name: 'Changer la conversation de '+character.name+' en '+discussion.name,
                            characterID: character.ID,
                            discussionID: discussion.ID
                        };
                        results.push(result);                    
                    }
                }
            });
        });

        this.role.responses.forEach(response => {
            response.rewards.forEach(reward => {
                if (reward instanceof DiscussionReward) {
                    let discussion: Discussion = this.role.discussions.find(discuss => discuss.ID == reward.discussionId) as Discussion;
                    let character: UnityCharacter = this.exportedRole.Character.find(char => char.name == discussion.character.name && char.phone == discussion.character.tel) as UnityCharacter;
                    if (!results.some(element => element.characterID == character.ID && element.discussionID == discussion.ID)) {
                        let result: UnityChangeDiscussionResult = {
                            ID: this.resultID++,
                            name: 'Changer la conversation de '+character.name+' en '+discussion.name,
                            characterID: character.ID,
                            discussionID: discussion.ID
                        };
                        results.push(result);                    
                    }
                }
            });
        });

        return results;
    }

    private getGetObjectResults(): UnityGetObjectResult[] {
        let results: UnityGetObjectResult[] = [];

        this.role.rewards.forEach(reward => {
            if (reward instanceof ObjectReward) {
                let item: UnityItem = this.exportedRole.Item.find(obj => obj.name == reward.object.name) as UnityItem;
                if (!results.some(element => element.objectID == item.ID && element.quantity == reward.quantity)) {
                    let resultID: number = this.resultID++;
                    let result: UnityGetObjectResult = {
                        ID: resultID,
                        name: 'Objet reçu : '+item.name,
                        quantity: reward.quantity,
                        objectID: item.ID
                    };
                    results.push(result);                    
                }
            }
        });

        this.role.tasks.forEach(inlineTasks => {
            inlineTasks.forEach(task => {
                if (task instanceof Task) {
                    task.rewards.forEach(reward => {
                        if (reward instanceof ObjectReward) {
                            let item: UnityItem = this.exportedRole.Item.find(obj => obj.name == reward.object.name) as UnityItem;
                            if (!results.some(element => element.objectID == item.ID && element.quantity == reward.quantity)) {
                                let resultID: number = this.resultID++;
                                let result: UnityGetObjectResult = {
                                    ID: resultID,
                                    name: 'Objet reçu : '+item.name,
                                    quantity: reward.quantity,
                                    objectID: item.ID
                                };
                                results.push(result);                    
                            }
                        }
                    });
                }
            });
        });

        this.role.discussions.forEach(discussion => {
            discussion.rewards.forEach(reward => {
                if (reward instanceof ObjectReward) {
                    let item: UnityItem = this.exportedRole.Item.find(obj => obj.name == reward.object.name) as UnityItem;
                    if (!results.some(element => element.objectID == item.ID && element.quantity == reward.quantity)) {
                        let resultID: number = this.resultID++;
                        let result: UnityGetObjectResult = {
                            ID: resultID,
                            name: 'Objet reçu : '+item.name,
                            quantity: reward.quantity,
                            objectID: item.ID
                        };
                        results.push(result);                    
                    }
                }
            });
        });

        this.role.sentences.forEach(sentence => {
            sentence.rewards.forEach(reward => {
                if (reward instanceof ObjectReward) {
                    let item: UnityItem = this.exportedRole.Item.find(obj => obj.name == reward.object.name) as UnityItem;
                    if (!results.some(element => element.objectID == item.ID && element.quantity == reward.quantity)) {
                        let resultID: number = this.resultID++;
                        let result: UnityGetObjectResult = {
                            ID: resultID,
                            name: 'Objet reçu : '+item.name,
                            quantity: reward.quantity,
                            objectID: item.ID
                        };
                        results.push(result);                    
                    }
                }
            });
        });

        this.role.responses.forEach(response => {
            response.rewards.forEach(reward => {
                if (reward instanceof ObjectReward) {
                    let item: UnityItem = this.exportedRole.Item.find(obj => obj.name == reward.object.name) as UnityItem;
                    if (!results.some(element => element.objectID == item.ID && element.quantity == reward.quantity)) {
                        let resultID: number = this.resultID++;
                        let result: UnityGetObjectResult = {
                            ID: resultID,
                            name: 'Objet reçu : '+item.name,
                            quantity: reward.quantity,
                            objectID: item.ID
                        };
                        results.push(result);                    
                    }
                }
            });
        });

        

        return results;
    }

    private getGetPhoneNumberResults(): UnityGetPhoneNumberResult[] {
        let results: UnityGetPhoneNumberResult[] = [];

        this.role.rewards.forEach(reward => {
            if (reward instanceof CharacterReward) {
                if (reward.character.reachableByPhone) {
                    let character: UnityCharacter = this.exportedRole.Character.find(char => char.name == reward.character.name && char.phone == reward.character.tel) as UnityCharacter;
                    if (!results.some(element => character.ID == element.characterID)) {
                        let resultID: number = this.resultID++;
                        let result: UnityGetPhoneNumberResult = {
                            ID: resultID,
                            characterID: character.ID,
                            name: 'Récupérer le numéro de '+character.name
                        };
                        results.push(result);
                    }                    
                }
            }
        });

        this.role.tasks.forEach(inlineTasks => {
            inlineTasks.forEach(task => {
                if (task instanceof Task) {
                    task.rewards.forEach(reward => {
                        if (reward instanceof CharacterReward) {
                            if (reward.character.reachableByPhone) {
                                let character: UnityCharacter = this.exportedRole.Character.find(char => char.name == reward.character.name && char.phone == reward.character.tel) as UnityCharacter;
                                if (!results.some(element => character.ID == element.characterID)) {
                                    let resultID: number = this.resultID++;
                                    let result: UnityGetPhoneNumberResult = {
                                        ID: resultID,
                                        characterID: character.ID,
                                        name: 'Récupérer le numéro de '+character.name
                                    };
                                    results.push(result);
                                }                                
                            }
                        }
                    });
                }
            });
        });

        this.role.discussions.forEach(discussion => {
            discussion.rewards.forEach(reward => {
                if (reward instanceof CharacterReward) {
                    if (reward.character.reachableByPhone) {
                        let character: UnityCharacter = this.exportedRole.Character.find(char => char.name == reward.character.name && char.phone == reward.character.tel) as UnityCharacter;
                        if (!results.some(element => character.ID == element.characterID)) {
                            let resultID: number = this.resultID++;
                            let result: UnityGetPhoneNumberResult = {
                                ID: resultID,
                                characterID: character.ID,
                                name: 'Récupérer le numéro de '+character.name
                            };
                            results.push(result);
                        }                        
                    }
                }
            });
        });

        this.role.sentences.forEach(sentence => {
            sentence.rewards.forEach(reward => {
                if (reward instanceof CharacterReward) {
                    if (reward.character.reachableByPhone) {
                        let character: UnityCharacter = this.exportedRole.Character.find(char => char.name == reward.character.name && char.phone == reward.character.tel) as UnityCharacter;
                        if (!results.some(element => character.ID == element.characterID)) {
                            let resultID: number = this.resultID++;
                            let result: UnityGetPhoneNumberResult = {
                                ID: resultID,
                                characterID: character.ID,
                                name: 'Récupérer le numéro de '+character.name
                            };
                            results.push(result);
                        }                        
                    }
                }
            });
        });

        this.role.responses.forEach(response => {
            response.rewards.forEach(reward => {
                if (reward instanceof CharacterReward) {
                    if (reward.character.reachableByPhone) {
                        let character: UnityCharacter = this.exportedRole.Character.find(char => char.name == reward.character.name && char.phone == reward.character.tel) as UnityCharacter;
                        if (!results.some(element => character.ID == element.characterID)) {
                            let resultID: number = this.resultID++;
                            let result: UnityGetPhoneNumberResult = {
                                ID: resultID,
                                characterID: character.ID,
                                name: 'Récupérer le numéro de '+character.name
                            };
                            results.push(result);
                        }                        
                    }
                }
            });
        });

        return results;
    }

    private getAddCharacterKnowledgementResults(): UnityAddCharacterKnowledgementResult[] {
        let results: UnityAddCharacterKnowledgementResult[] = [];

        return results;
    }

    private getEarnSkillResults(): UnityEarnSkillResult[] {
        let results: UnityEarnSkillResult[] = [];

        this.role.rewards.forEach(reward => {
            if (reward instanceof SkillReward) {
                let skill: UnitySkill = this.exportedRole.Skill.find(skl => skl.name == reward.skill.name) as UnitySkill;
                if (!results.some(element => element.skillID == skill.ID)) {
                    let resultID: number = this.resultID++;
                    let result: UnityEarnSkillResult = {
                        ID: resultID,
                        name: 'Compétence acquise : '+skill.name,
                        skillID: skill.ID
                    };
                    skill.resultID.push(resultID);
                    results.push(result);
                }
            }
        });

        this.role.tasks.forEach(inlineTasks => {
            inlineTasks.forEach(task => {
                if (task instanceof Task) {
                    task.rewards.forEach(reward => {
                        if (reward instanceof SkillReward) {
                            let skill: UnitySkill = this.exportedRole.Item.find(skl => skl.name == reward.skill.name) as UnitySkill;
                            if (!results.some(element => element.skillID == skill.ID)) {
                                let resultID: number = this.resultID++;
                                let result: UnityEarnSkillResult = {
                                    ID: resultID,
                                    name: 'Compétence acquise : '+skill.name,
                                    skillID: skill.ID
                                };
                                skill.resultID.push(resultID);
                                results.push(result);
                            }
                        }
                    });
                }
            });
        });

        this.role.discussions.forEach(discussion => {
            discussion.rewards.forEach(reward => {
                if (reward instanceof SkillReward) {
                    let skill: UnitySkill = this.exportedRole.Item.find(skl => skl.name == reward.skill.name) as UnitySkill;
                    if (!results.some(element => element.skillID == skill.ID)) {
                        let resultID: number = this.resultID++;
                        let result: UnityEarnSkillResult = {
                            ID: resultID,
                            name: 'Compétence acquise : '+skill.name,
                            skillID: skill.ID
                        };
                        skill.resultID.push(resultID);
                        results.push(result);
                    }
                }
            });
        });

        this.role.sentences.forEach(sentence => {
            sentence.rewards.forEach(reward => {
                if (reward instanceof SkillReward) {
                    let skill: UnitySkill = this.exportedRole.Item.find(skl => skl.name == reward.skill.name) as UnitySkill;
                    if (!results.some(element => element.skillID == skill.ID)) {
                        let resultID: number = this.resultID++;
                        let result: UnityEarnSkillResult = {
                            ID: resultID,
                            name: 'Compétence acquise : '+skill.name,
                            skillID: skill.ID
                        };
                        skill.resultID.push(resultID);
                        results.push(result);
                    }
                }
            });
        });

        this.role.responses.forEach(response => {
            response.rewards.forEach(reward => {
                if (reward instanceof SkillReward) {
                    let skill: UnitySkill = this.exportedRole.Item.find(skl => skl.name == reward.skill.name) as UnitySkill;
                    if (!results.some(element => element.skillID == skill.ID)) {
                        let resultID: number = this.resultID++;
                        let result: UnityEarnSkillResult = {
                            ID: resultID,
                            name: 'Compétence acquise : '+skill.name,
                            skillID: skill.ID
                        };
                        skill.resultID.push(resultID);
                        results.push(result);
                    }
                }
            });
        });

        return results;
    }

    private getSkillCategories(): UnitySkillCategory[] {
        let categories: UnitySkillCategory[] = [];

        let category: UnitySkillCategory = {
            ID: 0,
            name: 'Compétence non catégorisée',
            description: 'Ce fichier a été généré par RLG Maker, qui ne permet pas encore la création de catégories de compétences',
            skillsID: []
        };
        categories.push(category);

        return categories;
    }

    private getSkills(): UnitySkill[] {
        let skills: UnitySkill[] = [];

        this.role.ressources.forEach(ressource => {
            if (ressource.type == 'attribut') {
                if (!skills.some(skill => ressource.name == skill.name)) {
                    let skillID: number = this.skillID++;
                    let skill: UnitySkill = {
                        ID: skillID,
                        name: ressource.name,
                        description: '',
                        skillCategoryID: 0,
                        resultID: []
                    };
                    skills.push(skill);
                    this.exportedRole.SkillCategory[0].skillsID.push(skillID);
                }
            }
        });

        this.role.rewards.forEach(reward => {
            if (reward instanceof SkillReward) {
                if (!skills.some(skill => reward.skill.name == skill.name)) {
                    let skillID: number = this.skillID++;
                    let skill: UnitySkill = {
                        ID: skillID,
                        name: reward.skill.name,
                        description: '',
                        skillCategoryID: 0,
                        resultID: []
                    };
                    skills.push(skill);
                    this.exportedRole.SkillCategory[0].skillsID.push(skillID);
                }
            }
        });

        this.role.tasks.forEach(inlineTasks => {
            inlineTasks.forEach(task => {
                if (task instanceof Task) {
                    task.rewards.forEach(reward => {
                        if (reward instanceof SkillReward) {
                            if (!skills.some(skill => reward.skill.name == skill.name)) {
                                let skillID: number = this.skillID++;
                                let skill: UnitySkill = {
                                    ID: skillID,
                                    name: reward.skill.name,
                                    description: '',
                                    skillCategoryID: 0,
                                    resultID: []
                                };
                                skills.push(skill);
                                this.exportedRole.SkillCategory[0].skillsID.push(skillID);
                            }
                        }
                    });
                }
            });
        });

        this.role.discussions.forEach(discussion => {
            discussion.rewards.forEach(reward => {
                if (reward instanceof SkillReward) {
                    if (!skills.some(skill => reward.skill.name == skill.name)) {
                        let skillID: number = this.skillID++;
                        let skill: UnitySkill = {
                            ID: skillID,
                            name: reward.skill.name,
                            description: '',
                            skillCategoryID: 0,
                            resultID: []
                        };
                        skills.push(skill);
                        this.exportedRole.SkillCategory[0].skillsID.push(skillID);
                    }
                }
            });
        });

        this.role.sentences.forEach(sentence => {
            sentence.rewards.forEach(reward => {
                if (reward instanceof SkillReward) {
                    if (!skills.some(skill => reward.skill.name == skill.name)) {
                        let skillID: number = this.skillID++;
                        let skill: UnitySkill = {
                            ID: skillID,
                            name: reward.skill.name,
                            description: '',
                            skillCategoryID: 0,
                            resultID: []
                        };
                        skills.push(skill);
                        this.exportedRole.SkillCategory[0].skillsID.push(skillID);
                    }
                }
            });
        });

        this.role.responses.forEach(response => {
            response.rewards.forEach(reward => {
                if (reward instanceof SkillReward) {
                    if (!skills.some(skill => reward.skill.name == skill.name)) {
                        let skillID: number = this.skillID++;
                        let skill: UnitySkill = {
                            ID: skillID,
                            name: reward.skill.name,
                            description: '',
                            skillCategoryID: 0,
                            resultID: []
                        };
                        skills.push(skill);
                        this.exportedRole.SkillCategory[0].skillsID.push(skillID);
                    }
                }
            });
        });

        return skills;
    }

    private getItems(): UnityItem[] {
        let items: UnityItem[] = [];

        this.role.ressources.forEach(ressource => {
            if (ressource.type == 'object') {
                if (!items.some(item => ressource.name == item.name)) {
                    let item: UnityItem = {
                        ID: this.itemID++,
                        name: ressource.name,
                        description: ''
                    };
                    items.push(item);
                }
            }
        });

        this.role.rewards.forEach(reward => {
            if (reward instanceof ObjectReward) {
                if (!items.some(item => reward.object.name == item.name)) {
                    let item: UnityItem = {
                        ID: this.itemID++,
                        name: reward.object.name,
                        description: ''
                    };
                    items.push(item);               
                }
            }
        });

        this.role.tasks.forEach(inlineTasks => {
            inlineTasks.forEach(task => {
                if (task instanceof Task) {
                    if ((task.typeUnity == 'getObject' || task.typeUnity == 'interactObject') && task.object) {
                        if (!items.some(item => task.object?.name == item.name)) {
                            let item: UnityItem = {
                                ID: this.itemID++,
                                name: task.object?.name,
                                description: ''
                            };
                            items.push(item);
                        }
                    }
                    task.rewards.forEach(reward => {
                        if (reward instanceof ObjectReward) {
                            if (!items.some(item => reward.object.name == item.name)) {
                                let item: UnityItem = {
                                    ID: this.itemID++,
                                    name: reward.object.name,
                                    description: ''
                                }
                                items.push(item);              
                            }
                        }
                    });
                }
            });
        });

        this.role.discussions.forEach(discussion => {
            discussion.rewards.forEach(reward => {
                if (reward instanceof ObjectReward) {
                    if (!items.some(item => reward.object.name == item.name)) {
                        let item: UnityItem = {
                            ID: this.itemID++,
                            name: reward.object.name,
                            description: ''
                        }
                        items.push(item);              
                    }
                }
            });
        });

        this.role.sentences.forEach(sentence => {
            sentence.rewards.forEach(reward => {
                if (reward instanceof ObjectReward) {
                    if (!items.some(item => reward.object.name == item.name)) {
                        let item: UnityItem = {
                            ID: this.itemID++,
                            name: reward.object.name,
                            description: ''
                        }
                        items.push(item);              
                    }
                }
            });
        });

        this.role.sentences.forEach(sentence => {
            sentence.rewards.forEach(reward => {
                if (reward instanceof ObjectReward) {
                    if (!items.some(item => reward.object.name == item.name)) {
                        let item: UnityItem = {
                            ID: this.itemID++,
                            name: reward.object.name,
                            description: ''
                        }
                        items.push(item);              
                    }
                }
            });
        });

        this.role.responses.forEach(response => {
            response.rewards.forEach(reward => {
                if (reward instanceof ObjectReward) {
                    if (!items.some(item => reward.object.name == item.name)) {
                        let item: UnityItem = {
                            ID: this.itemID++,
                            name: reward.object.name,
                            description: ''
                        }
                        items.push(item);              
                    }
                }
            });
        });

        return items;
    }
}

interface UnityCharacter {
    name: string;
    ID: number;
    discussionID: number[];
    currentDiscussionID: number|undefined;
    phone: string;
}

interface UnityDiscussion {
    name: string;
    ID: number;
    sentenceID: number[];
    resultID: number[];
    firstSentence: number;
    characterID: number;
}

interface UnityInterrogativeSentence {
    ID: number;
    value: string;
    resultID: number[];
    idDiscussion: number;
    responseID: number[];
}

interface UnityDeclarativeSentence {
    ID: number;
    value: string;
    resultID: number[];
    idDiscussion: number;
    nextSentence: number;
}

interface UnityResponse {
    ID: number;
    value: string;
    nextSentence: number;
    resultID: number[];
    idInterrogativeSentence: number;
}

interface UnityQuest {
    name: string;
    ID: number;
    description: string;
    taskID: number[];
    resultID: number[];
    requiredQuestID: number[];
}

interface UnitySpeakToTask {
    ID: number;
    name: string;
    questID: number;
    description: string;
    requiredTaskID: number[];
    resultID: number[];
    characterID: number;
}

interface UnityGetObjectTask {
    ID: number;
    name: string;
    questID: number;
    description: string;
    requiredTaskID: number[];
    resultID: number[];
    objectID: number;
    quantity: number;
}

interface UnityInteractWithTask {
    ID: number;
    name: string;
    questID: number;
    description: string;
    requiredTaskID: number[];
    resultID: number[];
    objectID: number;
}

interface UnityBeginQuestResult {
    ID: number;
    name: string;
    questID: number;
}

interface UnityChangeDiscussionResult {
    ID: number;
    name: string;
    characterID: number;
    discussionID: number;
}

interface UnityGetObjectResult {
    ID: number;
    name: string;
    objectID: number;
    quantity: number;
}

interface UnityGetPhoneNumberResult {
    ID: number;
    name: string;
    characterID: number;
}

interface UnityAddCharacterKnowledgementResult {

}

interface UnityEarnSkillResult {
    ID: number;
    name: string;
    skillID: number;
}

interface UnitySkillCategory {
    ID: number;
    name: string;
    description: string;
    skillsID: number[];
}

interface UnitySkill {
    ID: number;
    name: string;
    description: string;
    skillCategoryID: number;
    resultID: number[];
}

interface UnityItem {
    name: string;
    ID: number;
    description: string;
}

interface UnityRole {
    Character: UnityCharacter[];
    Discussion: UnityDiscussion[];
    InterrogativeSentence: UnityInterrogativeSentence[];
    DeclarativeSentence: UnityDeclarativeSentence[];
    Response: UnityResponse[];
    Quests: UnityQuest[]
    SpeakToTask: UnitySpeakToTask[];
    GetObjectTasks: UnityGetObjectTask[];
    InteractWithTask: UnityInteractWithTask[];
    BeginQuestResult: UnityBeginQuestResult[];
    ChangeDiscussionResult: UnityChangeDiscussionResult[];
    GetObjectResult: UnityGetObjectResult[];
    GetPhoneNumberResult: UnityGetPhoneNumberResult[];
    AddCharacterKnowledgementResult: UnityAddCharacterKnowledgementResult[];
    EarnSkillResult: UnityEarnSkillResult[];
    SkillCategory: UnitySkillCategory[];
    Skill: UnitySkill[];
    Item: UnityItem[];
}