import * as path from 'path';

export const limwareFeatures = [
  {
    id: 'dashboardModule.*',
    parent_id: null,
    title: 'Dashboard Widgets',
    operation: '*',
  },

  // Limware Dashboard Controller
  {
    id: 'today-patients-count.*',
    parent_id: 'dashboardModule.*',
    title: 'Today Patients Count',
    operation: '*',
  },
  {
    id: 'limware-dashboard.today-patients-count',
    parent_id: 'today-patients-count.*',
    title: 'Today Patients Count',
    operation: 'r',
  },

  {
    id: 'today-pending-patients-count.*',
    parent_id: 'dashboardModule.*',
    title: 'Today Pending Patients Count',
    operation: '*',
  },
  {
    id: 'limware-dashboard.today-pending-patients-count',
    parent_id: 'today-pending-patients-count.*',
    title: 'Today Pending Patients Count',
    operation: 'r',
  },

  {
    id: 'today-dues.*',
    parent_id: 'dashboardModule.*',
    title: 'Today Dues',
    operation: '*',
  },
  {
    id: 'limware-dashboard.today-dues',
    parent_id: 'today-dues.*',
    title: 'Today Dues',
    operation: 'r',
  },

  {
    id: 'today-patients-list.*',
    parent_id: 'dashboardModule.*',
    title: 'Today Patients List',
    operation: '*',
  },
  {
    id: 'limware-dashboard.today-patients-list',
    parent_id: 'today-patients-list.*',
    title: 'Today Patients List',
    operation: 'r',
  },

  {
    id: 'today-sales.*',
    parent_id: 'dashboardModule.*',
    title: 'Today Sales',
    operation: '*',
  },
  {
    id: 'limware-dashboard.today-sales',
    parent_id: 'today-sales.*',
    title: 'Today Sales',
    operation: 'r',
  },

  {
    id: 'patientModule.*',
    parent_id: null,
    title: 'Patient Module',
    operation: '*',
  },

  // Appointment
  {
    id: 'appointments.*',
    parent_id: 'patientModule.*',
    title: 'Appointment',
    operation: '*',
  },

  {
    id: 'appointments.index',
    parent_id: 'appointments.*',
    title: 'View',
    operation: 'r',
  },
  { id: 'appointments.view', parent_id: 'appointments.index', title: '' },

  {
    id: 'appointments.create',
    parent_id: 'appointments.*',
    title: 'Create',
    operation: 'c',
  },
  { id: 'appointments.index', parent_id: 'appointments.create', title: '' },
  {
    id: 'appointments.get-all-tests',
    parent_id: 'appointments.create',
    title: '',
  },
  {
    id: 'appointments.get-all-references',
    parent_id: 'appointments.create',
    title: '',
  },
  {
    id: 'appointments.create-reference',
    parent_id: 'appointments.create',
    title: '',
  },
  { id: 'invoices.add-payment', parent_id: 'appointments.create', title: '' },
  {
    id: 'invoices.update-discount',
    parent_id: 'appointments.create',
    title: '',
  },
  {
    id: 'appointments.delete-test',
    parent_id: 'appointments.create',
    title: '',
  },
  {
    id: 'appointments.get-patient-test-for-delete',
    parent_id: 'appointments.delete-test',
    title: '',
  },
  {
    id: 'invoices.get-with-line-items',
    parent_id: 'appointments.create',
    title: '',
  },
  {
    id: 'donors.assign-to-patient',
    parent_id: 'appointments.create',
    title: '',
  },
  {
    id: 'patient-tests.update-sample-status',
    parent_id: 'appointments.create',
    title: '',
  },

  {
    id: 'appointments.update',
    parent_id: 'appointments.*',
    title: 'Update',
    operation: 'u',
  },
  { id: 'appointments.index', parent_id: 'appointments.update', title: '' },
  { id: 'appointments.add-tests', parent_id: 'appointments.update', title: '' },
  {
    id: 'invoices.get-with-line-items',
    parent_id: 'appointments.add-tests',
    title: '',
  },
  {
    id: 'appointments.get-all-tests',
    parent_id: 'appointments.add-tests',
    title: '',
  },
  { id: 'invoices.add-payment', parent_id: 'appointments.update', title: '' },
  {
    id: 'invoices.update-discount',
    parent_id: 'appointments.update',
    title: '',
  },
  {
    id: 'appointments.delete-test',
    parent_id: 'appointments.update',
    title: '',
  },
  {
    id: 'appointments.get-patient-test-for-delete',
    parent_id: 'appointments.delete-test',
    title: '',
  },
  {
    id: 'donors.assign-to-patient',
    parent_id: 'appointments.update',
    title: '',
  },
  {
    id: 'appointments.update-reference',
    parent_id: 'appointments.update',
    title: '',
  },
  {
    id: 'references.get-all',
    parent_id: 'appointments.update-reference',
    title: '',
  },
  {
    id: 'patient-tests.update-sample-status',
    parent_id: 'appointments.update',
    title: '',
  },

  {
    id: 'appointments.delete',
    parent_id: 'appointments.*',
    title: 'Delete',
    operation: 'd',
  },
  { id: 'appointments.index', parent_id: 'appointments.delete', title: '' },
  {
    id: 'appointments.search-patient',
    parent_id: 'appointments.index',
    title: '',
  },

  {
    id: 'donors.update-info',
    parent_id: 'donors.assign-to-patient',
    title: '',
  },
  {
    id: 'donors.search-by-mobile',
    parent_id: 'donors.assign-to-patient',
    title: '',
  },
  { id: 'donors.get-by-id', parent_id: 'donors.assign-to-patient', title: '' },

  // Patient
  {
    id: 'patients.*',
    parent_id: 'patientModule.*',
    title: 'Patient',
    operation: '*',
  },

  {
    id: 'patients.index',
    parent_id: 'patients.*',
    title: 'View',
    operation: 'r',
  },
  { id: 'patients.view', parent_id: 'patients.index', title: '' },
  { id: 'appointments.search-patient', parent_id: 'patients.view', title: '' },

  {
    id: 'patients.update',
    parent_id: 'patients.*',
    title: 'Update',
    operation: 'u',
  },
  { id: 'patients.index', parent_id: 'patients.update', title: 'View' },

  {
    id: 'assigned-tests.*',
    parent_id: 'patientModule.*',
    title: 'Assigned Tests',
    operation: '*',
  },

  {
    id: 'assigned-tests.get-assigned-patients',
    parent_id: 'assigned-tests.*',
    title: 'View',
    operation: 'r',
  },
  {
    id: 'assigned-tests.get-patient-details',
    parent_id: 'assigned-tests.get-assigned-patients',
    title: '',
  },
  {
    id: 'assigned-tests.get-test-parameters',
    parent_id: 'assigned-tests.get-patient-details',
    title: '',
  },

  {
    id: 'assigned-tests.update',
    parent_id: 'assigned-tests.*',
    title: 'Update',
    operation: 'u',
  },
  {
    id: 'assigned-tests.mark-as-done',
    parent_id: 'assigned-tests.update',
    title: '',
    operation: '',
  },
  {
    id: 'assigned-tests.convert-to-draft',
    parent_id: 'assigned-tests.update',
    title: '',
    operation: '',
  },
  {
    id: 'assigned-tests.update-notes',
    parent_id: 'assigned-tests.update',
    title: '',
    operation: '',
  },
  {
    id: 'appointments.search-patient',
    parent_id: 'assigned-tests.update',
    title: '',
  },
  {
    id: 'laboratory-settings.get-lab-setting-for-save-test',
    parent_id: 'assigned-tests.update',
    title: '',
    operation: '',
  },

  {
    id: 'patient-tests.*',
    parent_id: 'patientModule.*',
    title: 'Patients Tests',
    operation: '*',
  },
  {
    id: 'patient-tests.index',
    parent_id: 'patient-tests.*',
    title: 'View',
    operation: 'r',
  },

  {
    id: 'deleted-tests.*',
    parent_id: 'patientModule.*',
    title: 'Deleted Tests',
    operation: '*',
  },
  {
    id: 'deleted-tests.index',
    parent_id: 'deleted-tests.*',
    title: 'View',
    operation: 'r',
  },

  {
    id: 'delete-completed-test.*',
    parent_id: 'patientModule.*',
    title: 'Delete completed or done tests',
    operation: '*',
  },
  {
    id: 'appointments.delete-completed-test',
    parent_id: 'delete-completed-test.*',
    title: 'Delete completed or done tests',
    operation: 'd',
  },
  {
    id: 'appointments.get-patient-completed-test-for-delete',
    parent_id: 'appointments.delete-completed-test',
    title: '',
  },

  {
    id: 'donors.*',
    parent_id: 'patientModule.*',
    title: 'Donors',
    operation: '*',
  },
  { id: 'donors.index', parent_id: 'donors.*', title: 'View', operation: 'r' },
  { id: 'donors.view', parent_id: 'donors.index', title: '' },
  {
    id: 'donors.create',
    parent_id: 'donors.*',
    title: 'Create',
    operation: 'c',
  },
  { id: 'donors.index', parent_id: 'donors.create', title: '' },
  {
    id: 'donors.update',
    parent_id: 'donors.*',
    title: 'Update',
    operation: 'u',
  },
  { id: 'donors.index', parent_id: 'donors.update', title: '' },
  {
    id: 'donors.delete',
    parent_id: 'donors.*',
    title: 'Delete',
    operation: 'd',
  },
  { id: 'donors.index', parent_id: 'donors.delete', title: '' },

  {
    id: 'configurationModule.*',
    parent_id: null,
    title: 'Configuration Module',
    operation: '*',
  },

  {
    id: 'test-categories.*',
    parent_id: 'configurationModule.*',
    title: 'Test Categories',
    operation: '*',
  },

  {
    id: 'test-categories.index',
    parent_id: 'test-categories.*',
    title: 'View',
    operation: 'r',
  },
  { id: 'test-categories.view', parent_id: 'test-categories.index', title: '' },

  {
    id: 'test-categories.create',
    parent_id: 'test-categories.*',
    title: 'Create',
    operation: 'c',
  },
  {
    id: 'test-categories.index',
    parent_id: 'test-categories.create',
    title: '',
  },
  {
    id: 'departments.get-lab-departments',
    parent_id: 'test-categories.create',
    title: '',
  },
  {
    id: 'test-categories.get-parent-categories',
    parent_id: 'test-categories.create',
    title: '',
  },
  {
    id: 'report-templates.index',
    parent_id: 'test-categories.create',
    title: '',
  },

  {
    id: 'test-categories.update',
    parent_id: 'test-categories.*',
    title: 'Update',
    operation: 'u',
  },
  {
    id: 'test-categories.index',
    parent_id: 'test-categories.update',
    title: '',
  },
  {
    id: 'departments.get-lab-departments',
    parent_id: 'test-categories.update',
    title: '',
  },
  {
    id: 'tests.update-sequence',
    parent_id: 'test-categories.update',
    title: '',
  },
  {
    id: 'test-categories.get-parent-categories',
    parent_id: 'test-categories.update',
    title: '',
  },
  {
    id: 'report-templates.index',
    parent_id: 'test-categories.update',
    title: '',
  },

  {
    id: 'test-categories.delete',
    parent_id: 'test-categories.*',
    title: 'Delete',
    operation: 'd',
  },
  {
    id: 'test-categories.index',
    parent_id: 'test-categories.delete',
    title: '',
  },

  {
    id: 'tests.*',
    parent_id: 'configurationModule.*',
    title: 'Tests',
    operation: '*',
  },

  { id: 'tests.index', parent_id: 'tests.*', title: 'View', operation: 'r' },
  { id: 'tests.view', parent_id: 'tests.index', title: '' },
  {
    id: 'test-parameters.get-all-parameters',
    parent_id: 'tests.view',
    title: '',
  },

  { id: 'tests.create', parent_id: 'tests.*', title: 'Create', operation: 'c' },
  { id: 'tests.index', parent_id: 'tests.create', title: '' },
  { id: 'specimens.get-all', parent_id: 'tests.create', title: '' },
  { id: 'uom.get-all', parent_id: 'tests.create', title: '' },
  { id: 'test-categories.get-all', parent_id: 'tests.create', title: '' },
  {
    id: 'departments.get-lab-departments',
    parent_id: 'tests.create',
    title: '',
  },
  { id: 'tests.create-parametric-test', parent_id: 'tests.create', title: '' },

  { id: 'tests.update', parent_id: 'tests.*', title: 'Update', operation: 'u' },
  { id: 'tests.index', parent_id: 'tests.update', title: '' },
  { id: 'test-normal-ranges.*', parent_id: 'tests.update', title: '' },
  { id: 'test-parameters.*', parent_id: 'tests.update', title: '' },
  { id: 'test-groups.*', parent_id: 'tests.update', title: '' },
  { id: 'test-categories.get-all', parent_id: 'tests.update', title: '' },
  {
    id: 'departments.get-lab-departments',
    parent_id: 'tests.update',
    title: '',
  },
  { id: 'tests.create-parametric-test', parent_id: 'tests.update', title: '' },

  { id: 'tests.delete', parent_id: 'tests.*', title: 'Delete', operation: 'd' },
  { id: 'tests.index', parent_id: 'tests.delete', title: '' },

  {
    id: 'lab-test-rate-lists.*',
    parent_id: 'configurationModule.*',
    title: 'Test Rate Lists',
    operation: '*',
  },

  {
    id: 'lab-test-rate-lists.index',
    parent_id: 'lab-test-rate-lists.*',
    title: 'View',
    operation: 'r',
  },
  {
    id: 'lab-test-rate-lists.view',
    parent_id: 'lab-test-rate-lists.index',
    title: '',
  },
  {
    id: 'lab-test-rate-lists.print-rate-list',
    parent_id: 'lab-test-rate-lists.index',
    title: '',
  },
  {
    id: 'lab-test-rate-lists.get-all-tests',
    parent_id: 'lab-test-rate-lists.view',
    title: '',
  },

  {
    id: 'lab-test-rate-lists.create',
    parent_id: 'lab-test-rate-lists.*',
    title: 'Create',
    operation: 'c',
  },
  {
    id: 'lab-test-rate-lists.index',
    parent_id: 'lab-test-rate-lists.create',
    title: '',
  },
  {
    id: 'lab-test-rate-lists.get-all-tests',
    parent_id: 'lab-test-rate-lists.create',
    title: '',
  },
  {
    id: 'lab-test-rate-lists.make-copy',
    parent_id: 'lab-test-rate-lists.create',
    title: '',
  },

  {
    id: 'lab-test-rate-lists.update',
    parent_id: 'lab-test-rate-lists.*',
    title: 'Update',
    operation: 'u',
  },
  {
    id: 'lab-test-rate-lists.index',
    parent_id: 'lab-test-rate-lists.update',
    title: '',
  },

  {
    id: 'lab-test-rate-lists.delete',
    parent_id: 'lab-test-rate-lists.*',
    title: 'Delete',
    operation: 'd',
  },
  {
    id: 'lab-test-rate-lists.index',
    parent_id: 'lab-test-rate-lists.delete',
    title: '',
  },

  {
    id: 'references.*',
    parent_id: 'configurationModule.*',
    title: 'References',
    operation: '*',
  },

  {
    id: 'references.index',
    parent_id: 'references.*',
    title: 'View',
    operation: 'r',
  },
  { id: 'references.view', parent_id: 'references.index', title: '' },
  {
    id: 'references.get-reference-details',
    parent_id: 'references.view',
    title: '',
  },
  { id: 'references.get-patients', parent_id: 'references.view', title: '' },
  { id: 'references.get-tests', parent_id: 'references.view', title: '' },
  {
    id: 'references.print-referred-patients-report',
    parent_id: 'references.view',
    title: '',
  },

  {
    id: 'references.create',
    parent_id: 'references.*',
    title: 'Create',
    operation: 'c',
  },
  { id: 'references.index', parent_id: 'references.create', title: '' },

  {
    id: 'references.update',
    parent_id: 'references.*',
    title: 'Update',
    operation: 'u',
  },
  { id: 'references.index', parent_id: 'references.update', title: '' },

  {
    id: 'references.delete',
    parent_id: 'references.*',
    title: 'Delete',
    operation: 'd',
  },
  { id: 'references.index', parent_id: 'references.delete', title: '' },

  {
    id: 'test-normal-ranges.view',
    parent_id: 'test-normal-ranges.*',
    title: '',
  },
  {
    id: 'test-normal-ranges.create',
    parent_id: 'test-normal-ranges.*',
    title: '',
  },
  {
    id: 'test-normal-ranges.update',
    parent_id: 'test-normal-ranges.*',
    title: '',
  },
  {
    id: 'test-normal-ranges.delete',
    parent_id: 'test-normal-ranges.*',
    title: '',
  },
  {
    id: 'test-normal-ranges.update-sequence',
    parent_id: 'test-normal-ranges.*',
    title: '',
  },

  {
    id: 'test-parameters.get-all-parameters',
    parent_id: 'test-parameters.*',
    title: '',
  },
  { id: 'test-parameters.view', parent_id: 'test-parameters.*', title: '' },
  {
    id: 'test-parameters.get-unassigned-parameters',
    parent_id: 'test-parameters.*',
    title: '',
  },
  {
    id: 'test-parameters.create-multiple',
    parent_id: 'test-parameters.*',
    title: '',
  },
  { id: 'test-parameters.update', parent_id: 'test-parameters.*', title: '' },
  { id: 'test-parameters.delete', parent_id: 'test-parameters.*', title: '' },
  {
    id: 'test-parameters.update-sequence',
    parent_id: 'test-parameters.update',
    title: '',
  },

  { id: 'test-groups.get-all-groups', parent_id: 'test-groups.*', title: '' },
  { id: 'test-groups.view', parent_id: 'test-groups.*', title: '' },
  { id: 'test-groups.create', parent_id: 'test-groups.*', title: '' },
  { id: 'test-groups.update', parent_id: 'test-groups.*', title: '' },
  {
    id: 'test-groups.update-sequence',
    parent_id: 'test-groups.update',
    title: '',
  },
  {
    id: 'test-groups.delete-and-unlink-parameters',
    parent_id: 'test-groups.*',
    title: '',
  },
  {
    id: 'test-groups.delete-with-parameters',
    parent_id: 'test-groups.*',
    title: '',
  },

  {
    id: 'hrModule.*',
    parent_id: null,
    title: 'Human Resource Module',
    operation: '*',
  },
  {
    id: 'employees.*',
    parent_id: 'hrModule.*',
    title: 'Employees',
    operation: '*',
  },
  {
    id: 'employees.index',
    parent_id: 'employees.*',
    title: 'View',
    operation: 'r',
  },
  { id: 'employees.view', parent_id: 'employees.index', title: '' },
  {
    id: 'employees-facilities.get-by-employee',
    parent_id: 'employees.view',
    title: '',
  },
  {
    id: 'employees.create',
    parent_id: 'employees.*',
    title: 'Create',
    operation: 'c',
  },
  { id: 'employees.index', parent_id: 'employees.create', title: '' },
  {
    id: 'employees.update',
    parent_id: 'employees.*',
    title: 'Update',
    operation: 'u',
  },
  { id: 'employees.index', parent_id: 'employees.update', title: '' },
  {
    id: 'users.create-facility-user',
    parent_id: 'employees.update',
    title: '',
  },
  {
    id: 'employees.delete',
    parent_id: 'employees.*',
    title: 'Delete',
    operation: 'd',
  },
  { id: 'employees.index', parent_id: 'employees.delete', title: '' },

  {
    id: 'employees-facilities.*',
    parent_id: 'hrModule.*',
    title: 'Employee Facilities',
    operation: '*',
  },
  {
    id: 'employees-facilities.index',
    parent_id: 'employees-facilities.*',
    title: 'View',
    operation: 'r',
  },
  {
    id: 'employees-facilities.view',
    parent_id: 'employees-facilities.index',
    title: '',
  },
  {
    id: 'employees-facilities.create',
    parent_id: 'employees-facilities.*',
    title: 'Create',
    operation: 'c',
  },
  {
    id: 'employees-facilities.index',
    parent_id: 'employees-facilities.create',
    title: '',
  },
  {
    id: 'employees-facilities.get-unassigned-facilities',
    parent_id: 'employees-facilities.create',
    title: '',
  },
  {
    id: 'roles.get-by-portal',
    parent_id: 'employees-facilities.create',
    title: '',
  },
  {
    id: 'departments.get-by-facility',
    parent_id: 'employees-facilities.create',
    title: '',
  },
  {
    id: 'employees-facilities.update',
    parent_id: 'employees-facilities.*',
    title: 'Update',
    operation: 'u',
  },
  {
    id: 'employees-facilities.index',
    parent_id: 'employees-facilities.update',
    title: '',
  },
  {
    id: 'employees-facilities.get-unassigned-facilities',
    parent_id: 'employees-facilities.update',
    title: '',
  },
  {
    id: 'roles.get-by-portal',
    parent_id: 'employees-facilities.update',
    title: '',
  },
  {
    id: 'departments.get-by-facility',
    parent_id: 'employees-facilities.update',
    title: '',
  },
  {
    id: 'employees-facilities.delete',
    parent_id: 'employees-facilities.*',
    title: 'Delete',
    operation: 'd',
  },
  {
    id: 'employees-facilities.index',
    parent_id: 'employees-facilities.delete',
    title: '',
  },
  {
    id: 'departments.*',
    parent_id: 'hrModule.*',
    title: 'Departments',
    operation: '*',
  },
  {
    id: 'departments.index',
    parent_id: 'departments.*',
    title: 'View',
    operation: 'r',
  },
  { id: 'departments.view', parent_id: 'departments.index', title: '' },
  {
    id: 'departments.create',
    parent_id: 'departments.*',
    title: 'Create',
    operation: 'c',
  },
  { id: 'departments.index', parent_id: 'departments.create', title: '' },
  {
    id: 'departments.update',
    parent_id: 'departments.*',
    title: 'Update',
    operation: 'u',
  },
  { id: 'departments.index', parent_id: 'departments.update', title: '' },
  {
    id: 'departments.delete',
    parent_id: 'departments.*',
    title: 'Delete',
    operation: 'd',
  },
  { id: 'departments.index', parent_id: 'departments.delete', title: '' },

  {
    id: 'securityModule.*',
    parent_id: null,
    title: 'Security Module',
    operation: '*',
  },
  {
    id: 'users.*',
    parent_id: 'securityModule.*',
    title: 'Users',
    operation: '*',
  },
  { id: 'users.index', parent_id: 'users.*', title: 'View', operation: 'r' },
  { id: 'users.view', parent_id: 'users.index', title: 'View' },
  {
    id: 'users.create-new',
    parent_id: 'users.*',
    title: 'Create',
    operation: 'c',
  },
  { id: 'users.index', parent_id: 'users.create-new', title: '' },
  { id: 'users.update', parent_id: 'users.*', title: 'Update', operation: 'u' },
  { id: 'users.index', parent_id: 'users.update', title: '' },
  { id: 'users.delete', parent_id: 'users.*', title: 'Delete', operation: 'd' },
  { id: 'users.index', parent_id: 'users.delete', title: '' },
  {
    id: 'facilityConfigurationModule.*',
    parent_id: null,
    title: 'Facility Configuration',
    operation: '*',
  },
  {
    id: 'facilities.*',
    parent_id: 'facilityConfigurationModule.*',
    title: 'Facility',
    operation: '*',
  },
  {
    id: 'facilities.view-facility-for-limware',
    parent_id: 'facilities.*',
    title: 'View',
    operation: 'r',
  },
  {
    id: 'facilities.update-facility-for-limware',
    parent_id: 'facilities.*',
    title: 'Update',
    operation: 'u',
  },
  {
    id: 'facilities.view-facility-for-limware',
    parent_id: 'facilities.update-facility-for-limware',
    title: '',
  },

  {
    id: 'laboratories.*',
    parent_id: 'facilityConfigurationModule.*',
    title: 'Laboratory',
    operation: '*',
  },
  {
    id: 'laboratories.view-lab-for-limware',
    parent_id: 'laboratories.*',
    title: 'View',
    operation: 'r',
  },
  {
    id: 'laboratories.update-lab-for-limware',
    parent_id: 'laboratories.*',
    title: 'Update',
    operation: 'u',
  },
  {
    id: 'laboratories.view-lab-for-limware',
    parent_id: 'laboratories.update-lab-for-limware',
    title: '',
  },
  {
    id: 'report-print-settings.view',
    parent_id: 'laboratories.view-lab-for-limware',
    title: '',
  },
  {
    id: 'report-print-settings.get-header-image',
    parent_id: 'report-print-settings.view',
    title: '',
  },
  {
    id: 'report-print-settings.get-footer-image',
    parent_id: 'report-print-settings.view',
    title: '',
  },
  {
    id: 'report-print-settings.save-report-settings',
    parent_id: 'laboratories.update-lab-for-limware',
    title: '',
  },
  {
    id: 'report-print-settings.view',
    parent_id: 'report-print-settings.save-report-settings',
    title: '',
  },
  {
    id: 'report-print-settings.save-header-image',
    parent_id: 'report-print-settings.save-report-settings',
    title: '',
  },
  {
    id: 'report-print-settings.save-footer-image',
    parent_id: 'report-print-settings.save-report-settings',
    title: '',
  },
  {
    id: 'report-print-settings.save-header-text',
    parent_id: 'report-print-settings.save-report-settings',
    title: '',
  },
  {
    id: 'report-print-settings.save-footer-text',
    parent_id: 'report-print-settings.save-report-settings',
    title: '',
  },
  {
    id: 'report-print-settings.change-header-type',
    parent_id: 'report-print-settings.save-report-settings',
    title: '',
  },
  {
    id: 'report-print-settings.change-footer-type',
    parent_id: 'report-print-settings.save-report-settings',
    title: '',
  },
  {
    id: 'invoice-print-settings.view',
    parent_id: 'laboratories.view-lab-for-limware',
    title: '',
  },
  {
    id: 'invoice-print-settings.get-logo-image',
    parent_id: 'invoice-print-settings.view',
    title: '',
  },

  {
    id: 'invoice-print-settings.save-logo-image',
    parent_id: 'laboratories.update-lab-for-limware',
    title: '',
  },
  {
    id: 'invoice-print-settings.save-footer-text',
    parent_id: 'laboratories.update-lab-for-limware',
    title: '',
  },
  {
    id: 'laboratory-settings.update-setting',
    parent_id: 'laboratories.update-lab-for-limware',
    title: '',
  },
  {
    id: 'laboratory-settings.index',
    parent_id: 'laboratory-settings.update-setting',
    title: '',
  },
  {
    id: 'facility-sms-settings.*',
    parent_id: 'facilityConfigurationModule.*',
    title: 'SMS Settings',
    operation: '*',
  },
  {
    id: 'facility-sms-settings.index',
    parent_id: 'facility-sms-settings.*',
    title: 'View',
    operation: 'r',
  },
  {
    id: 'addons.get-my-addons',
    parent_id: 'facility-sms-settings.index',
    title: '',
  },
  {
    id: 'facility-sms-settings.update-sms',
    parent_id: 'facility-sms-settings.*',
    title: 'Update',
    operation: 'u',
  },
  {
    id: 'facility-sms-settings.index',
    parent_id: 'facility-sms-settings.update-sms',
    title: 'View',
  },

  {
    id: 'reports.patient-count-report',
    parent_id: 'reportsModule.*',
    title: 'Patient Count Report',
    operation: '*',
  },
  {
    id: 'reports.get-patient-count-report',
    parent_id: 'reports.patient-count-report',
    title: 'Get Patient Count Report',
    operation: 'r',
  },
  {
    id: 'reports.print-patient-count-report',
    parent_id: 'reports.get-patient-count-report',
    title: 'Print Patient Count Report',
  },
  {
    id: 'reports.sales-report',
    parent_id: 'reportsModule.*',
    title: 'Sales Report (Patient Wise)',
    operation: '*',
  },
  {
    id: 'reports.get-sales-report',
    parent_id: 'reports.sales-report',
    title: 'Get Sales Report',
    operation: 'r',
  },
  {
    id: 'reports.print-sales-report',
    parent_id: 'reports.get-sales-report',
    title: 'Print Sales Report',
  },
  {
    id: 'reports.due-payment-report',
    parent_id: 'reportsModule.*',
    title: 'Due Payment Report',
    operation: '*',
  },
  {
    id: 'reports.get-due-payment-report',
    parent_id: 'reports.due-payment-report',
    title: 'Get Due Payment Report',
    operation: 'r',
  },
  {
    id: 'reports.print-due-payment-report',
    parent_id: 'reports.get-due-payment-report',
    title: 'Print Due Payment Report',
  },
  {
    id: 'reports.patient-daily-count-report',
    parent_id: 'reportsModule.*',
    title: 'Patient Count - Daily',
    operation: '*',
  },
  {
    id: 'reports.get-patient-daily-count-report',
    parent_id: 'reports.patient-daily-count-report',
    title: 'Get Patient Count Daily Report',
    operation: 'r',
  },
  {
    id: 'reports.print-patient-daily-count-report',
    parent_id: 'reports.get-patient-daily-count-report',
    title: 'Print Patient Count Daily Report',
  },
  {
    id: 'reports.daily-sales-report',
    parent_id: 'reportsModule.*',
    title: 'Sales - Daily',
    operation: '*',
  },
  {
    id: 'reports.get-daily-sales-report',
    parent_id: 'reports.daily-sales-report',
    title: 'Get Sales Daily Report',
    operation: 'r',
  },
  {
    id: 'reports.print-daily-sales-report',
    parent_id: 'reports.get-daily-sales-report',
    title: 'Print Sales Daily Report',
  },
];

export const administrationFeatures = [
  // Customer Module
  {
    id: 'customersModule.*',
    parent_id: null,
    title: 'Customers Module',
    operation: '*',
  },
  {
    id: 'customers.*',
    parent_id: 'customersModule.*',
    title: 'Customers',
    operation: '*',
  },
  {
    id: 'customers.index',
    parent_id: 'customers.*',
    title: 'View',
    operation: 'r',
  },
  { id: 'customers.view', parent_id: 'customers.index', title: 'View' },
  { id: 'facilities.get-by-customer', parent_id: 'customers.view', title: '' },
  {
    id: 'laboratories.get-by-customer',
    parent_id: 'customers.view',
    title: '',
  },
  {
    id: 'customers.create',
    parent_id: 'customers.*',
    title: 'Create',
    operation: 'c',
  },
  { id: 'customers.index', parent_id: 'customers.create', title: 'Create' },
  {
    id: 'customers.update',
    parent_id: 'customers.*',
    title: 'Update',
    operation: 'u',
  },
  { id: 'customers.index', parent_id: 'customers.update', title: '' },
  {
    id: 'customers.delete',
    parent_id: 'customers.*',
    title: 'Delete',
    operation: 'd',
  },
  { id: 'customers.index', parent_id: 'customers.delete', title: '' },

  //   Facility Module
  {
    id: 'facilities.*',
    parent_id: 'customersModule.*',
    title: 'Facilities',
    operation: '*',
  },
  {
    id: 'facilities.index',
    parent_id: 'facilities.*',
    title: 'View',
    operation: 'r',
  },
  { id: 'facilities.view', parent_id: 'facilities.index', title: '' },
  { id: 'employees.get-by-facility', parent_id: 'facilities.view', title: '' },
  {
    id: 'facilities.create',
    parent_id: 'facilities.*',
    title: 'Create',
    operation: 'c',
  },
  { id: 'facilities.index', parent_id: 'facilities.create', title: '' },
  {
    id: 'facilities.get-parent-facilities',
    parent_id: 'facilities.create',
    title: '',
  },
  {
    id: 'facilities.update',
    parent_id: 'facilities.*',
    title: 'Update',
    operation: 'u',
  },
  { id: 'facilities.index', parent_id: 'facilities.update', title: '' },
  {
    id: 'facilities.get-parent-facilities',
    parent_id: 'facilities.update',
    title: '',
  },
  {
    id: 'facilities.delete',
    parent_id: 'facilities.*',
    title: 'Delete',
    operation: 'd',
  },
  { id: 'facilities.index', parent_id: 'facilities.delete', title: '' },

  //   Employee Module
  {
    id: 'employees.*',
    parent_id: 'customersModule.*',
    title: 'Employees',
    operation: '*',
  },
  {
    id: 'employees.index',
    parent_id: 'employees.*',
    title: 'View',
    operation: 'r',
  },
  { id: 'employees.view', parent_id: 'employees.index', title: '' },
  {
    id: 'employees-facilities.get-by-employee',
    parent_id: 'employees.view',
    title: '',
  },
  {
    id: 'employees.create',
    parent_id: 'employees.*',
    title: 'Create',
    operation: 'c',
  },
  { id: 'employees.index', parent_id: 'employees.create', title: '' },
  { id: 'employees-facilities.*', parent_id: 'employees.create', title: '' },
  {
    id: 'employees-facilities.index',
    parent_id: 'employees-facilities.*',
    title: '',
  },
  {
    id: 'employees-facilities.view',
    parent_id: 'employees-facilities.*',
    title: '',
  },
  {
    id: 'employees-facilities.create',
    parent_id: 'employees-facilities.*',
    title: '',
  },
  {
    id: 'employees-facilities.update',
    parent_id: 'employees-facilities.*',
    title: '',
  },
  {
    id: 'employees-facilities.delete',
    parent_id: 'employees-facilities.*',
    title: '',
  },
  {
    id: 'employees-facilities.get-unassigned-facilities',
    parent_id: 'employees-facilities.*',
    title: '',
  },
  {
    id: 'employees.update',
    parent_id: 'employees.*',
    title: 'Update',
    operation: 'u',
  },
  { id: 'employees.index', parent_id: 'employees.update', title: '' },
  {
    id: 'users.create-facility-user',
    parent_id: 'employees.update',
    title: '',
  },
  { id: 'employees-facilities.*', parent_id: 'employees.update', title: '' },
  { id: 'roles.get-by-portal', parent_id: 'employees.update', title: '' },
  {
    id: 'employees.delete',
    parent_id: 'employees.*',
    title: 'Delete',
    operation: 'd',
  },
  { id: 'employees.index', parent_id: 'employees.delete', title: '' },
  { id: 'employees-facilities.*', parent_id: 'employees.delete', title: '' },

  // Security Module
  {
    id: 'securityModule.*',
    parent_id: null,
    title: 'Security Module',
    operation: '*',
  },
  {
    id: 'users.*',
    parent_id: 'securityModule.*',
    title: 'Users',
    operation: '*',
  },
  { id: 'users.index', parent_id: 'users.*', title: 'View', operation: 'r' },
  { id: 'users.view', parent_id: 'users.index', title: 'View' },
  {
    id: 'users.create-new',
    parent_id: 'users.*',
    title: 'Create',
    operation: 'c',
  },
  { id: 'users.index', parent_id: 'users.create-new', title: 'Create' },
  { id: 'users.update', parent_id: 'users.*', title: 'Update', operation: 'u' },
  { id: 'users.index', parent_id: 'users.update', title: '' },
  { id: 'users.delete', parent_id: 'users.*', title: 'Delete', operation: 'd' },
  { id: 'users.index', parent_id: 'users.delete', title: '' },

  //   roles module
  {
    id: 'roles.*',
    parent_id: 'securityModule.*',
    title: 'Users',
    operation: '*',
  },
  { id: 'roles.index', parent_id: 'roles.*', title: 'View', operation: 'r' },
  { id: 'roles.view', parent_id: 'roles.index', title: 'View' },
  { id: 'roles.create', parent_id: 'roles.*', title: 'Create', operation: 'c' },
  { id: 'roles.index', parent_id: 'roles.create', title: 'Create' },
  { id: 'roles.update', parent_id: 'roles.*', title: 'Update', operation: 'u' },
  { id: 'roles.index', parent_id: 'roles.update', title: '' },
  { id: 'roles.delete', parent_id: 'roles.*', title: 'Delete', operation: 'd' },
  { id: 'roles.index', parent_id: 'roles.delete', title: '' },

  //   Configuration Module
  {
    id: 'configurationModule.*',
    parent_id: null,
    title: 'Configuration Module',
    operation: '*',
  },

  // Specimen module
  {
    id: 'specimens.*',
    parent_id: 'customersModule.*',
    title: 'Specimens',
    operation: '*',
  },
  {
    id: 'specimens.index',
    parent_id: 'specimens.*',
    title: 'View',
    operation: 'r',
  },
  { id: 'specimens.view', parent_id: 'specimens.index', title: '' },
  {
    id: 'specimens.create',
    parent_id: 'specimens.*',
    title: 'Create',
    operation: 'c',
  },
  { id: 'specimens.index', parent_id: 'specimens.create', title: '' },
  {
    id: 'specimens.update',
    parent_id: 'specimens.*',
    title: 'Update',
    operation: 'u',
  },
  { id: 'specimens.index', parent_id: 'specimens.update', title: '' },
  {
    id: 'specimens.delete',
    parent_id: 'specimens.*',
    title: 'Delete',
    operation: 'd',
  },
  { id: 'specimens.index', parent_id: 'specimens.delete', title: '' },

  //   UOM Module
  {
    id: 'uom.*',
    parent_id: 'customersModule.*',
    title: 'Unit of measure',
    operation: '*',
  },
  { id: 'uom.index', parent_id: 'uom.*', title: 'View', operation: 'r' },
  { id: 'uom.view', parent_id: 'uom.index', title: '' },
  { id: 'uom.create', parent_id: 'uom.*', title: 'Create', operation: 'c' },
  { id: 'uom.index', parent_id: 'uom.create', title: '' },
  { id: 'uom.update', parent_id: 'uom.*', title: 'Update', operation: 'u' },
  { id: 'uom.index', parent_id: 'uom.update', title: '' },
  { id: 'uom.delete', parent_id: 'uom.*', title: 'Delete', operation: 'd' },
  { id: 'uom.index', parent_id: 'uom.delete', title: '' },

  //   Outgoing Mail Server Module
  {
    id: 'outgoing-mail-servers.*',
    parent_id: 'configurationModule.*',
    title: 'Outgoing Mail Server',
    operation: '*',
  },
  {
    id: 'outgoing-mail-servers.index',
    parent_id: 'outgoing-mail-servers.*',
    title: 'View',
    operation: 'r',
  },
  {
    id: 'outgoing-mail-servers.view',
    parent_id: 'outgoing-mail-servers.index',
    title: 'View',
  },
  {
    id: 'outgoing-mail-servers.create',
    parent_id: 'outgoing-mail-servers.*',
    title: 'Create',
    operation: 'c',
  },
  {
    id: 'outgoing-mail-servers.index',
    parent_id: 'outgoing-mail-servers.create',
    title: '',
  },
  {
    id: 'outgoing-mail-servers.update',
    parent_id: 'outgoing-mail-servers.*',
    title: 'Update',
    operation: 'u',
  },
  {
    id: 'outgoing-mail-servers.index',
    parent_id: 'outgoing-mail-servers.update',
    title: '',
  },
  {
    id: 'outgoing-mail-servers.delete',
    parent_id: 'outgoing-mail-servers.*',
    title: 'Delete',
    operation: 'd',
  },
  {
    id: 'outgoing-mail-servers.index',
    parent_id: 'outgoing-mail-servers.delete',
    title: '',
  },

  //   Email Template
  {
    id: 'email-templates.*',
    parent_id: 'configurationModule.*',
    title: 'Email Templates',
    operation: '*',
  },
  {
    id: 'email-templates.index',
    parent_id: 'email-templates.*',
    title: 'View',
    operation: 'r',
  },
  {
    id: 'email-templates.view',
    parent_id: 'email-templates.index',
    title: 'View',
  },
  {
    id: 'email-templates.get-all-outgoing-mail-servers',
    parent_id: 'email-templates.view',
    title: 'View',
  },
  {
    id: 'email-templates.create',
    parent_id: 'email-templates.*',
    title: 'Create',
    operation: 'c',
  },
  {
    id: 'email-templates.index',
    parent_id: 'email-templates.create',
    title: '',
  },
  {
    id: 'email-templates.update',
    parent_id: 'email-templates.*',
    title: 'Update',
    operation: 'u',
  },
  {
    id: 'email-templates.index',
    parent_id: 'email-templates.update',
    title: '',
  },
  {
    id: 'email-templates.delete',
    parent_id: 'email-templates.*',
    title: 'Delete',
    operation: 'd',
  },
  {
    id: 'email-templates.index',
    parent_id: 'email-templates.delete',
    title: '',
  },
];

export const reportsModule = {
  id: 'reportsModule.*',
  parent_id: null,
  title: 'Reports',
  operation: '*',
  status: false,
  children: [
    {
      id: 'reports.patient-count-report',
      parent_id: 'reportsModule.*',
      title: 'Patient Count Report',
      operation: '*',
      status: true,
      children: [
        {
          id: 'reports.get-patient-count-report',
          parent_id: 'reports.patient-count-report',
          title: 'Get Patient Count Report',
          operation: 'r',
          status: true,
          children: [],
        },
      ],
    },
    {
      id: 'reports.sales-report',
      parent_id: 'reportsModule.*',
      title: 'Sales Report (Patient Wise)',
      operation: '*',
      status: true,
      children: [
        {
          id: 'reports.get-sales-report',
          parent_id: 'reports.sales-report',
          title: 'Get Sales Report',
          operation: 'r',
          status: true,
          children: [],
        },
      ],
    },
    {
      id: 'reports.due-payment-report',
      parent_id: 'reportsModule.*',
      title: 'Due Payment Report',
      operation: '*',
      status: true,
      children: [
        {
          id: 'reports.get-due-payment-report',
          parent_id: 'reports.due-payment-report',
          title: 'Get Due Payment Report',
          operation: 'r',
          status: true,
          children: [],
        },
      ],
    },
    {
      id: 'reports.patient-daily-count-report',
      parent_id: 'reportsModule.*',
      title: 'Patient Count - Daily',
      operation: '*',
      status: true,
      children: [
        {
          id: 'reports.get-patient-daily-count-report',
          parent_id: 'reports.patient-daily-count-report',
          title: 'Get Patient Count Daily Report',
          operation: 'r',
          status: true,
          children: [],
        },
      ],
    },
    {
      id: 'reports.daily-sales-report',
      parent_id: 'reportsModule.*',
      title: 'Sales - Daily',
      operation: '*',
      status: true,
      children: [
        {
          id: 'reports.get-daily-sales-report',
          parent_id: 'reports.daily-sales-report',
          title: 'Get Sales Daily Report',
          operation: 'r',
          status: true,
          children: [],
        },
      ],
    },
  ],
};

export const options = {
  format: 'A4',
  border: {
    left: '7px',
    right: '0px',
    top: '16px',
    bottom: '16px',
  },
  margin: {
    left: 10,
    right: 10,
    top: 0,
    bottom: 0,
  },
  header: {
    height: '10px',
  },
  footer: {
    height: '8px',
  },
};

export const emailRegex = /^[\w.-]+@[a-zA-Z_-]+?(?:\.[a-zA-Z]{2,})+$/;
