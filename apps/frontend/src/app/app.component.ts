import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ApiService } from './shared/services/api.service';
import {
  DeputyHistoryResponse,
  DeputySearchItem,
  ProjectDetailResponse,
  ProjectSearchItem,
} from './shared/models/api.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTabsModule,
    MatIconModule,
    MatButtonToggleModule,
  ],
  template: `
    <div class="container">
      <mat-card class="hero">
        <h1>Radar Legislativo</h1>
        <p>Consulte projetos de lei, votos por deputado e impacto social.</p>
      </mat-card>

      <mat-tab-group>
        <mat-tab label="Projetos">
          <section class="section">
            <form [formGroup]="projectForm" class="search-row">
              <mat-form-field appearance="outline" class="grow">
                <mat-label>Pesquisar projeto de lei</mat-label>
                <input matInput formControlName="query" placeholder="Ex: saude, PL 1234" />
              </mat-form-field>
              <button
                mat-flat-button
                class="search-primary-btn"
                (click)="onSearchProjects()"
                [disabled]="isLoadingProject"
              >
                Pesquisar
              </button>
            </form>

            <div *ngIf="isLoadingProject" class="loading-box">
              <mat-spinner diameter="32"></mat-spinner>
              <span>Buscando e salvando dados do projeto...</span>
            </div>

            <div *ngIf="projectResults.length > 0" class="results-header">
              <h3>Resultados encontrados</h3>
              <span>{{ projectResults.length }} projeto(s)</span>
            </div>

            <div class="cards-grid project-results-grid">
              <mat-card class="project-item" *ngFor="let item of projectResults">
                <h3>{{ item.title }}</h3>
                <p>{{ item.summary }}</p>
                <mat-chip-set>
                  <mat-chip>{{ item.status }}</mat-chip>
                  <mat-chip *ngIf="item.source">Fonte: {{ item.source }}</mat-chip>
                  <mat-chip *ngIf="item.votesCount !== undefined">Votacoes: {{ item.votesCount }}</mat-chip>
                </mat-chip-set>
                <button
                  mat-flat-button
                  class="detail-action-btn"
                  (click)="onLoadProject(item.externalId)"
                  [disabled]="isLoadingProject"
                >
                  Ver detalhes
                </button>
              </mat-card>
            </div>

            <mat-card *ngIf="selectedProject" class="detail">
              <div class="detail-header">
                <h2>{{ selectedProject.project.title }}</h2>
                <p>{{ selectedProject.project.summary }}</p>
              </div>

              <div class="detail-stats" *ngIf="selectedProject.project.voteSummary">
                <div class="stat-card">
                  <span>Total</span>
                  <strong>{{ selectedProject.project.voteSummary.total }}</strong>
                </div>
                <div class="stat-card stat-yes">
                  <span>A favor</span>
                  <strong>{{ selectedProject.project.voteSummary.favor }}</strong>
                </div>
                <div class="stat-card stat-no">
                  <span>Contra</span>
                  <strong>{{ selectedProject.project.voteSummary.contra }}</strong>
                </div>
                <div class="stat-card stat-neutral">
                  <span>Abstencoes</span>
                  <strong>{{ selectedProject.project.voteSummary.abstencao }}</strong>
                </div>
              </div>

              <div class="chips-line">
                <mat-chip>{{ selectedProject.project.relevance.label }}</mat-chip>
                <mat-chip>Score {{ selectedProject.project.relevance.score }}</mat-chip>
                <mat-chip>{{ selectedProject.project.relevance.interestType }}</mat-chip>
                <mat-chip *ngIf="selectedProject.project.source">Fonte: {{ selectedProject.project.source }}</mat-chip>
              </div>

              <div class="vote-filter-modern">
                <button
                  type="button"
                  [class.active]="voteFilter === 'todos'"
                  (click)="voteFilter = 'todos'"
                >
                  Todos
                </button>
                <button
                  type="button"
                  [class.active]="voteFilter === 'favor'"
                  (click)="voteFilter = 'favor'"
                >
                  A favor
                </button>
                <button
                  type="button"
                  [class.active]="voteFilter === 'contra'"
                  (click)="voteFilter = 'contra'"
                >
                  Contra
                </button>
              </div>

              <p *ngIf="selectedProject.deputies.length === 0" class="warning">
                Este projeto nao possui votacao nominal registrada no endpoint consultado.
              </p>

              <div class="cards-grid deputies deputies-grid">
                <mat-card class="deputy-card" *ngFor="let deputy of filteredDeputies()">
                  <img [src]="deputy.photoUrl || 'https://via.placeholder.com/120x120?text=Deputado'" alt="Foto do deputado" />
                  <div>
                    <strong>{{ deputy.name }}</strong>
                    <p>{{ deputy.party }} - {{ deputy.state }}</p>
                    <span class="vote-pill" [ngClass]="votePillClass(deputy.vote)">{{ deputy.vote }}</span>
                  </div>
                </mat-card>
              </div>
            </mat-card>
          </section>
        </mat-tab>

        <mat-tab label="Deputados">
          <section class="section">
            <form [formGroup]="deputyForm" class="search-row">
              <mat-form-field appearance="outline" class="grow">
                <mat-label>Pesquisar deputado local</mat-label>
                <input matInput formControlName="query" placeholder="Digite nome do deputado" />
              </mat-form-field>
              <button
                mat-flat-button
                class="search-primary-btn"
                (click)="onSearchDeputies()"
                [disabled]="isLoadingDeputy"
              >
                Buscar
              </button>
            </form>

            <div *ngIf="isLoadingDeputy" class="loading-box">
              <mat-spinner diameter="32"></mat-spinner>
              <span>Buscando historico do deputado...</span>
            </div>

            <div *ngIf="deputyResults.length > 0" class="results-header">
              <h3>Deputados encontrados</h3>
              <span>{{ deputyResults.length }} deputado(s)</span>
            </div>

            <div class="cards-grid project-results-grid">
              <mat-card class="project-item" *ngFor="let deputy of deputyResults">
                <img
                  class="deputy-result-photo"
                  [src]="deputy.photoUrl || 'https://via.placeholder.com/120x120?text=Deputado'"
                  alt="Foto do deputado"
                />
                <h3>{{ deputy.name }}</h3>
                <p>{{ deputy.party }} - {{ deputy.state }}</p>
                <button
                  mat-flat-button
                  class="detail-action-btn"
                  (click)="onLoadDeputy(deputy.externalId)"
                  [disabled]="isLoadingDeputy"
                >
                  Ver historico
                </button>
              </mat-card>
            </div>

            <mat-card *ngIf="selectedDeputy" class="detail">
              <h2>{{ selectedDeputy.deputy.name }}</h2>
              <p>{{ selectedDeputy.deputy.party }} - {{ selectedDeputy.deputy.state }}</p>
              <div class="chips-line">
                <mat-chip>Interesse do povo: {{ selectedDeputy.metrics.interessePovoPercent }}%</mat-chip>
                <mat-chip>Interesse proprio: {{ selectedDeputy.metrics.interesseProprioPercent }}%</mat-chip>
              </div>
              <div class="vote-list">
                <mat-card class="vote-item" *ngFor="let vote of selectedDeputy.votes">
                  <div class="vote-item-header">
                    <strong>{{ vote.projectTitle }}</strong>
                    <span class="vote-pill" [ngClass]="votePillClass(vote.vote)">{{ vote.vote }}</span>
                  </div>
                  <p>Relevancia: {{ vote.relevanceLabel }} ({{ vote.relevanceScore }})</p>
                </mat-card>
              </div>
            </mat-card>
          </section>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [
    `
      .hero {
        margin-bottom: 18px;
        border-radius: 18px;
        padding: 14px 20px;
        background: linear-gradient(135deg, #1f6feb, #0f766e);
        color: #fff;
        box-shadow: 0 14px 26px rgba(20, 72, 112, 0.22);
      }

      .section {
        padding-top: 16px;
      }

      .search-row {
        display: grid;
        grid-template-columns: minmax(0, 1fr) 160px;
        gap: 14px;
        align-items: center;
        padding: 14px;
        border: 1px solid #d8e3ea;
        border-radius: 12px;
        background: #ffffff;
        box-shadow: 0 6px 14px rgba(10, 37, 64, 0.06);
      }

      .search-row .mat-mdc-form-field {
        width: 100%;
        margin: 0;
      }

      .search-row .mat-mdc-text-field-wrapper {
        background: #ffffff;
      }

      .grow {
        flex: 1;
      }

      .search-primary-btn {
        width: 100%;
        height: 56px;
        border-radius: 12px;
        font-weight: 700;
        letter-spacing: 0.2px;
        color: #fff !important;
        background: linear-gradient(135deg, #1f6feb, #1a7aa5);
        box-shadow: 0 10px 20px rgba(31, 111, 235, 0.25);
        align-self: center;
      }

      .search-primary-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 12px 24px rgba(31, 111, 235, 0.32);
      }

      .cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 16px;
        margin-top: 16px;
      }

      .project-results-grid {
        grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
        margin-bottom: 18px;
      }

      .results-header {
        margin-top: 18px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }

      .results-header h3 {
        margin: 0;
        font-size: 1.06rem;
      }

      .results-header span {
        color: #3c5668;
        font-size: 0.9rem;
      }

      .loading-box {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 16px 0;
        padding: 10px 12px;
        border: 1px dashed #9eb6c6;
        border-radius: 10px;
        background: #f8fbfd;
      }

      .detail {
        margin-top: 16px;
        background: #ffffff;
        border: 1px solid #d8e3ea;
        box-shadow: 0 8px 18px rgba(10, 37, 64, 0.08);
        border-radius: 14px;
        padding: 14px;
      }

      .detail-header {
        border-bottom: 1px solid #e4edf3;
        padding-bottom: 10px;
        margin-bottom: 12px;
      }

      .detail-header h2 {
        margin: 0 0 10px;
      }

      .detail-header p {
        margin: 0;
        line-height: 1.45;
      }

      .detail-stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(120px, 1fr));
        gap: 10px;
        margin: 8px 0 14px;
      }

      .stat-card {
        border: 1px solid #d5e2ea;
        border-radius: 10px;
        padding: 10px 12px;
        background: #f8fbfd;
      }

      .stat-card span {
        display: block;
        font-size: 0.82rem;
        color: #4a6578;
      }

      .stat-card strong {
        display: block;
        margin-top: 4px;
        font-size: 1.2rem;
      }

      .stat-yes {
        border-color: #9ad5b4;
        background: #eefbf2;
      }

      .stat-no {
        border-color: #f0a4a4;
        background: #fff2f2;
      }

      .stat-neutral {
        border-color: #d3c28f;
        background: #fff9ea;
      }

      .project-item {
        background: #ffffff;
        border: 1px solid #d8e3ea;
        box-shadow: 0 8px 18px rgba(10, 37, 64, 0.08);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        padding: 14px;
      }

      .project-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 24px rgba(10, 37, 64, 0.12);
      }

      .project-item h3 {
        margin: 0 0 10px;
        font-size: 1.45rem;
        line-height: 1.15;
      }

      .project-item p {
        min-height: 92px;
        line-height: 1.45;
        margin: 0 0 10px;
      }

      .project-item button {
        margin-top: 10px;
        width: 100%;
      }

      .detail-action-btn {
        color: #fff !important;
        background: linear-gradient(135deg, #1f6feb, #1a7aa5) !important;
        border-radius: 10px;
        font-weight: 700;
        min-height: 42px;
        box-shadow: 0 8px 16px rgba(31, 111, 235, 0.22);
      }

      .detail-action-btn:hover {
        box-shadow: 0 10px 18px rgba(31, 111, 235, 0.3);
      }

      .deputies .deputy-card {
        display: grid;
        grid-template-columns: 72px 1fr;
        gap: 12px;
        align-items: center;
        background: #ffffff;
        border: 1px solid #d8e3ea;
        border-left: 4px solid #1f6feb;
        box-shadow: 0 8px 14px rgba(10, 37, 64, 0.08);
        padding: 10px;
      }

      .deputies-grid {
        margin-top: 14px;
      }

      .deputy-card img {
        width: 72px;
        height: 72px;
        object-fit: cover;
        border-radius: 12px;
      }

      .deputy-card strong {
        font-size: 1.02rem;
      }

      .deputy-card p {
        margin: 6px 0 10px;
        color: #325064;
      }

      .vote-pill {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        border: 1px solid #9fb3c2;
        background: #f4f8fb;
        font-size: 0.83rem;
        font-weight: 600;
      }

      .vote-pill.yes {
        background: #e9f8ee;
        border-color: #8dc7a7;
        color: #116b35;
      }

      .vote-pill.no {
        background: #fff0f0;
        border-color: #dc9a9a;
        color: #a52222;
      }

      .vote-pill.other {
        background: #fff9ea;
        border-color: #d8c18a;
        color: #7e5b00;
      }

      .chips-line {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin: 10px 0;
      }

      .vote-list {
        display: grid;
        gap: 12px;
        margin-top: 12px;
      }

      .vote-item {
        background: #ffffff;
        border: 1px solid #d8e3ea;
        box-shadow: 0 6px 12px rgba(10, 37, 64, 0.06);
        border-radius: 10px;
        padding: 12px 14px;
      }

      .vote-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }

      .vote-item p {
        margin: 0;
        color: #355569;
        line-height: 1.35;
      }

      .deputy-result-photo {
        width: 72px;
        height: 72px;
        object-fit: cover;
        border-radius: 12px;
        margin-bottom: 8px;
      }

      .vote-filter-modern {
        margin: 10px 0 14px;
        display: inline-flex;
        gap: 6px;
        padding: 6px;
        border-radius: 999px;
        border: 1px solid #d8e3ea;
        background: linear-gradient(180deg, #f7fbff, #edf4fa);
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
      }

      .vote-filter-modern button {
        border: 0;
        border-radius: 999px;
        background: transparent;
        color: #2f4d62;
        font-weight: 600;
        font-size: 0.9rem;
        padding: 7px 14px;
        cursor: pointer;
        transition: all 0.18s ease;
      }

      .vote-filter-modern button:hover {
        background: rgba(31, 111, 235, 0.1);
      }

      .vote-filter-modern button.active {
        color: #fff;
        background: linear-gradient(135deg, #1f6feb, #1a7aa5);
        box-shadow: 0 6px 14px rgba(31, 111, 235, 0.3);
      }

      .warning {
        background: #fff3cd;
        border: 1px solid #ffe69c;
        color: #664d03;
        border-radius: 8px;
        padding: 10px;
      }

      @media (max-width: 900px) {
        .detail-stats {
          grid-template-columns: repeat(2, minmax(120px, 1fr));
        }

        .cards-grid {
          grid-template-columns: 1fr;
        }

        .search-row {
          grid-template-columns: 1fr;
        }

        .vote-filter-modern {
          width: 100%;
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class AppComponent {
  readonly projectForm = this.formBuilder.group({
    query: [''],
  });
  readonly deputyForm = this.formBuilder.group({
    query: [''],
  });

  isLoadingProject = false;
  isLoadingDeputy = false;
  projectResults: ProjectSearchItem[] = [];
  deputyResults: DeputySearchItem[] = [];
  selectedProject: ProjectDetailResponse | null = null;
  selectedDeputy: DeputyHistoryResponse | null = null;
  voteFilter: 'todos' | 'favor' | 'contra' = 'todos';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly apiService: ApiService,
  ) {}

  onSearchProjects(): void {
    const query = this.projectForm.value.query ?? '';
    this.isLoadingProject = true;
    this.selectedProject = null;
    this.apiService.searchProjects(query).subscribe({
      next: (data) => {
        this.projectResults = data;
      },
      error: () => {
        this.projectResults = [];
      },
      complete: () => {
        this.isLoadingProject = false;
      },
    });
  }

  onLoadProject(externalId: string): void {
    this.isLoadingProject = true;
    this.voteFilter = 'todos';
    this.apiService.getProjectDetail(externalId).subscribe({
      next: (data) => {
        this.selectedProject = data;
      },
      error: () => {
        this.selectedProject = null;
      },
      complete: () => {
        this.isLoadingProject = false;
      },
    });
  }

  filteredDeputies() {
    if (!this.selectedProject) {
      return [];
    }
    if (this.voteFilter === 'todos') {
      return this.selectedProject.deputies;
    }
    return this.selectedProject.deputies.filter((deputy) => {
      const normalized = deputy.vote
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
      return this.voteFilter === 'favor' ? normalized === 'sim' : normalized === 'nao';
    });
  }

  votePillClass(vote: string): string {
    const normalized = vote
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
    if (normalized === 'sim') return 'yes';
    if (normalized === 'nao') return 'no';
    return 'other';
  }

  onSearchDeputies(): void {
    const query = this.deputyForm.value.query ?? '';
    this.isLoadingDeputy = true;
    this.selectedDeputy = null;
    this.apiService.searchDeputies(query).subscribe({
      next: (data) => {
        this.deputyResults = data;
      },
      error: () => {
        this.deputyResults = [];
      },
      complete: () => {
        this.isLoadingDeputy = false;
      },
    });
  }

  onLoadDeputy(externalId: string): void {
    this.isLoadingDeputy = true;
    this.apiService.getDeputyHistory(externalId).subscribe({
      next: (data) => {
        this.selectedDeputy = data;
      },
      error: () => {
        this.selectedDeputy = null;
      },
      complete: () => {
        this.isLoadingDeputy = false;
      },
    });
  }
}
