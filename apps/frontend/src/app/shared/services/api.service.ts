import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  DeputyHistoryResponse,
  DeputySearchItem,
  ProjectDetailResponse,
  ProjectSearchItem,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:3000/api';

  constructor(private readonly http: HttpClient) {}

  searchProjects(query: string): Observable<ProjectSearchItem[]> {
    return this.http
      .get<{ data: ProjectSearchItem[] }>(`${this.baseUrl}/projects/search`, { params: { query } })
      .pipe(map((response) => response.data));
  }

  getProjectDetail(externalId: string): Observable<ProjectDetailResponse> {
    return this.http.get<ProjectDetailResponse>(`${this.baseUrl}/projects/${externalId}`);
  }

  searchDeputies(query: string): Observable<DeputySearchItem[]> {
    return this.http
      .get<{ data: DeputySearchItem[] }>(`${this.baseUrl}/deputies`, { params: { query } })
      .pipe(map((response) => response.data));
  }

  getDeputyHistory(externalId: string): Observable<DeputyHistoryResponse> {
    return this.http.get<DeputyHistoryResponse>(`${this.baseUrl}/deputies/${externalId}/votes`);
  }
}
