import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Profile } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  baseUrl = 'http://localhost:3010/api';

  async getProfiles(): Promise<Profile[]> {
    try {
      const response = firstValueFrom(
        this.http.get<Profile[]>(this.baseUrl + '/profiles')
      );
      if (response) return response;
      else return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async getProfileById(id: string): Promise<Profile | null> {
    try {
      const response = firstValueFrom(
        this.http.get<Profile>(`${this.baseUrl}/profiles/${id}`)
      );
      if (response) return response;
      else return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async register(profile: {
    name: string;
    login: string;
    password: string;
  }): Promise<Profile | null> {
    try {
      // const profiles = await this.getProfiles();
      // const exists = profiles.find(
      //   (element) => element.login === profile.login
      // );
      // if (!exists) {
      const response = firstValueFrom(
        this.http.put<Profile>(this.baseUrl + '/profiles', profile)
      );
      if (response) return response;
      else return null;
      // } else {
      //   console.log('User already exists.');
      //   return 'exists';
      // }
    } catch (error) {
      console.error('Registration failed.', error);
      return null;
    }
  }

  async login(profile: {
    login: string;
    password: string;
  }): Promise<Profile | null> {
    try {
      // const profiles = await this.getProfiles();
      // const exists = profiles.find(
      //   (element) => element.login === profile.login
      // );
      // if (exists) {
      const response = await firstValueFrom(
        this.http.post<Profile>(`${this.baseUrl}/login`, profile)
      );
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        return response;
      } else return null;
      // } else {
      //   console.log('User does not exist.');
      //   return 'exists';
      // }
    } catch (error) {
      console.error('Login failed', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
