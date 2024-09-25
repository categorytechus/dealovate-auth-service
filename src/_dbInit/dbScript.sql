//------------------------------------------------- Primary feed
//-------------------------- login_types
INSERT INTO auth_types(type_name, type_desc, is_active, created_at, created_by, updated_at, updated_by)VALUES ('password', 'password', 1, now(), 'superadmin', now(), 'superadmin');
INSERT INTO auth_types(type_name, type_desc, is_active, created_at, created_by, updated_at, updated_by)VALUES ('google', 'google', 1, now(), 'superadmin', now(), 'superadmin');
INSERT INTO auth_types(type_name, type_desc, is_active, created_at, created_by, updated_at, updated_by)VALUES ('linkedin', 'linkedin', 1, now(), 'superadmin', now(), 'superadmin');
//-------------------------- roles
INSERT INTO roles(role_name, role_desc, role_claim, is_active, created_at, created_by, updated_at, updated_by)VALUES ('superadmin', 'superadmin', '{}', 1, now(), 'superadmin', now(), 'superadmin');
INSERT INTO roles(role_name, role_desc, role_claim, is_active, created_at, created_by, updated_at, updated_by)VALUES ('tenantadmin', 'tenantadmin', '{}', 1, now(), 'tenantadmin', now(), 'superadmin');
INSERT INTO roles(role_name, role_desc, role_claim, is_active, created_at, created_by, updated_at, updated_by)VALUES ('founder', 'founder', '{}', 1, now(), 'superadmin', now(), 'superadmin');
INSERT INTO roles(role_name, role_desc, role_claim, is_active, created_at, created_by, updated_at, updated_by)VALUES ('investor', 'investor', '{}', 1, now(), 'superadmin', now(), 'superadmin');
INSERT INTO roles(role_name, role_desc, role_claim, is_active, created_at, created_by, updated_at, updated_by)VALUES ('advisor', 'advisor', '{}', 1, now(), 'superadmin', now(), 'superadmin');
INSERT INTO roles(role_name, role_desc, role_claim, is_active, created_at, created_by, updated_at, updated_by)VALUES ('evaluator', 'evaluator', '{}', 1, now(), 'superadmin', now(), 'superadmin');
//-------------------------- users
INSERT INTO users(user_type, first_name, last_name, email, is_email_verified, mobile, is_mobile_verfied, alternate_mobile, gender, nationality, language, currency, timezone, dob, profile_picture, other_info, is_active, created_at, created_by, updated_at, updated_by)
	VALUES (1, 'Super', 'Admin', 'superadmin@gmail.com', 1, '9192783450', 1, '9192783451', 'Male', 'Indian', 'hindi', 'INR', 2, null, '', '{}', 1, now(), 'superadmin', now(),'superadmin');
 //--------------------------- user_logins
INSERT INTO user_logins(user_id, user_name, hash_password, login_type, last_login_at, user_claim, is_blocked, is_active, created_at, created_by, updated_at, updated_by)
	VALUES ('f917d934-db62-4db8-958d-da2f058a0573','superadmin@gmail.com','$2b$12$14dUGyZmab0iBi5IGpHTBOJaJFtMKvnMKl2dACiuMadWfH/tmDft6', 'password', null, '{}', 0, 1, now(), 'superadmin', now(), 'superadmin');   

//------------------------------------------------------------------------------ functions
CREATE OR REPLACE FUNCTION f_get_appointments(
    userid uuid,
	startdate character varying DEFAULT ''::character varying,
	enddate character varying DEFAULT ''::character varying
	)
    RETURNS TABLE(
	"appointmentId" uuid, 
	"typeId" integer, 
	"typeName" character varying, 
	"title" character varying, 
	"startDate" character varying, 
	"endDate" character varying, 
	"startTime" character varying, 
	"endTime" character varying, 
	"location" character varying, 
	"statusId" integer, 
	"statusName" character varying, 
	"hostId" uuid,
	"hostName" character varying,
	"description" character varying, 
	"userType" character varying) 
    LANGUAGE 'plpgsql'
AS $BODY$
begin	
	return query
	select 
		apnt.appointment_id,
		apnt.type_id,
		''::varchar type_name,
		apnt.title,
		apnt.start_date::varchar,
		apnt.end_date::varchar,
		apnt.start_time::varchar,
		apnt.end_time::varchar,
		apnt.location,
		apnt.status_id,
		''::varchar status_name,
		apnt.host_id,
		(us.first_name||' '|| us.last_name)::varchar host_name,
		apnt.description,
		case when apnt.created_by = userid::varchar then 'host' else 'guest' end::varchar as user_type 
	from appointments apnt inner join appointment_users apntu
	on apnt.appointment_id = apntu.appointment_id
	inner join users us on apnt.host_id = us.user_id
	where
		apntu.user_id = userid;

end;
$BODY$;