import Uppy from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import { Resources } from '@instigo-app/data-transfer-object';
import { DashboardOptions } from '@uppy/dashboard';
import { SelectSnapshot } from '@ngxs-labs/select-snapshot';
import { AuthState } from '@app/security/auth.state';
import { WorkspaceState } from '@app/pages/state/workspace.state';
import { ControlValueAccessor } from '@angular/forms';

export abstract class UppyBase implements ControlValueAccessor {
  public notFetchable = false;
  public props: DashboardOptions = {
    showRemoveButtonAfterComplete: true,
    height: 300,
    proudlyDisplayPoweredByUppy: false,
  };
  public uppy: Uppy;
  protected _maxFiles = 1;

  @SelectSnapshot(AuthState.get) private token: string;
  @SelectSnapshot(WorkspaceState.workspaceId) private workspaceId: string;

  protected constructor(private size: number, private mediaType: string[]) {
    this.initUppy();
  }

  private get headers() {
    const headers = {};
    headers[`Authorization`] = `Bearer ${this.token}`;
    headers['Current-Workspace'] = `${this.workspaceId || null}`;
    headers['Access-Control-Allow-Origin'] = `*`;
    headers['Business-Entity'] = 'ad-templates';
    return headers;
  }

  onChange: any = () => {};
  onTouch: any = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  abstract writeValue(images: any[] | any): void;

  public removeExistingFile(): void {
    this.notFetchable = false;
    this.uppy.reset();
    this.onChange(null);
  }

  private initUppy(): void {
    this.uppy = new Uppy({
      autoProceed: true,
      debug: false,
      restrictions: {
        maxNumberOfFiles: Number(this._maxFiles),
        maxFileSize: this.size,
        allowedFileTypes: this.mediaType,
      },
    }).use(XHRUpload, {
      endpoint: `/server/${Resources.FILES}/upload`,
      headers: this.headers,
    });
  }
}
