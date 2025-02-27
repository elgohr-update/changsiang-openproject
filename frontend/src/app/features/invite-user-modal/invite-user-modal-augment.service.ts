// -- copyright
// OpenProject is an open source project management software.
// Copyright (C) 2012-2022 the OpenProject GmbH
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See COPYRIGHT and LICENSE files for more details.
//++

import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OpModalService } from 'core-app/shared/components/modal/modal.service';
import { CurrentProjectService } from 'core-app/core/current-project/current-project.service';
import { InviteUserModalComponent } from './invite-user.component';
import ClickEvent = JQuery.ClickEvent;

const attributeSelector = '[invite-user-modal-augment]';

/**
 * This service triggers user-invite modals to clicks on elements
 * with the attribute [invite-user-modal-augment] set.
 */
@Injectable({ providedIn: 'root' })
export class OpInviteUserModalAugmentService {
  constructor(
    @Inject(DOCUMENT) protected documentElement:Document,
    protected opModalService:OpModalService,
    protected currentProjectService:CurrentProjectService,
  ) { }

  /**
   * Create initial listeners for Rails-rendered modals
   */
  public setupListener() {
    const matches = this.documentElement.querySelectorAll(attributeSelector);
    for (let i = 0; i < matches.length; ++i) {
      const el = matches[i] as HTMLElement;
      el.addEventListener('click', this.spawnModal.bind(this));
    }
  }

  private spawnModal(event:ClickEvent) {
    event.preventDefault();

    this.opModalService.show(
      InviteUserModalComponent,
      'global',
      { projectId: this.currentProjectService.id },
    ).subscribe((modal) => modal
      .closingEvent
      .subscribe((modal:InviteUserModalComponent) => {
        // Just reload the page for now if we saved anything
        if (modal.data) {
          window.location.reload();
        }
      }));
  }
}
