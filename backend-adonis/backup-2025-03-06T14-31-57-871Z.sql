--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8 (Ubuntu 16.8-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: permission_scope; Type: TYPE; Schema: public; Owner: jefjel_owner
--


CREATE TYPE public.permission_scope AS ENUM (
    'all',
    'tenant',
    'own',
    'dept'
);


ALTER TYPE public.permission_scope OWNER TO jefjel_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.addresses (
    id integer NOT NULL,
    type text DEFAULT 'shipping'::text NOT NULL,
    address_line1 character varying(255) NOT NULL,
    address_line2 character varying(255),
    city character varying(255) NOT NULL,
    state character varying(255),
    country character varying(255) NOT NULL,
    postal_code character varying(255),
    phone character varying(255),
    is_default boolean DEFAULT false,
    tenant_id integer NOT NULL,
    zone_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT addresses_type_check CHECK ((type = ANY (ARRAY['shipping'::text, 'billing'::text])))
);


ALTER TABLE public.addresses OWNER TO jefjel_owner;

--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addresses_id_seq OWNER TO jefjel_owner;

--
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- Name: adonis_schema; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.adonis_schema (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    batch integer NOT NULL,
    migration_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.adonis_schema OWNER TO jefjel_owner;

--
-- Name: adonis_schema_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.adonis_schema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adonis_schema_id_seq OWNER TO jefjel_owner;

--
-- Name: adonis_schema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.adonis_schema_id_seq OWNED BY public.adonis_schema.id;


--
-- Name: adonis_schema_versions; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.adonis_schema_versions (
    version integer NOT NULL
);


ALTER TABLE public.adonis_schema_versions OWNER TO jefjel_owner;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer NOT NULL,
    tenant_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.cart_items OWNER TO jefjel_owner;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_items_id_seq OWNER TO jefjel_owner;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    user_id integer NOT NULL,
    tenant_id integer NOT NULL,
    status text DEFAULT 'active'::text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT carts_status_check CHECK ((status = ANY (ARRAY['active'::text, 'ordered'::text, 'archived'::text])))
);


ALTER TABLE public.carts OWNER TO jefjel_owner;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_id_seq OWNER TO jefjel_owner;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    icon character varying(255),
    parent_id integer,
    tenant_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO jefjel_owner;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO jefjel_owner;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: category_products; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.category_products (
    id integer NOT NULL,
    category_id integer NOT NULL,
    product_id integer NOT NULL
);


ALTER TABLE public.category_products OWNER TO jefjel_owner;

--
-- Name: category_products_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.category_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.category_products_id_seq OWNER TO jefjel_owner;

--
-- Name: category_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.category_products_id_seq OWNED BY public.category_products.id;


--
-- Name: deliveries; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.deliveries (
    id integer NOT NULL,
    order_id integer NOT NULL,
    delivery_person_id integer NOT NULL,
    notes text,
    assigned_at timestamp with time zone,
    picked_at timestamp with time zone,
    delivered_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.deliveries OWNER TO jefjel_owner;

--
-- Name: deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deliveries_id_seq OWNER TO jefjel_owner;

--
-- Name: deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.deliveries_id_seq OWNED BY public.deliveries.id;


--
-- Name: delivery_person_zones; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.delivery_person_zones (
    id integer NOT NULL,
    delivery_person_id integer NOT NULL,
    zone_id integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.delivery_person_zones OWNER TO jefjel_owner;

--
-- Name: delivery_person_zones_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.delivery_person_zones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_person_zones_id_seq OWNER TO jefjel_owner;

--
-- Name: delivery_person_zones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.delivery_person_zones_id_seq OWNED BY public.delivery_person_zones.id;


--
-- Name: delivery_persons; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.delivery_persons (
    id integer NOT NULL,
    user_id integer NOT NULL,
    tenant_id integer NOT NULL,
    is_active boolean DEFAULT true,
    is_available boolean DEFAULT true,
    last_active_at timestamp with time zone,
    last_delivery_at timestamp with time zone,
    vehicle_type text NOT NULL,
    vehicle_plate_number character varying(255) NOT NULL,
    vehicle_model character varying(255),
    vehicle_year integer,
    license_number character varying(255) NOT NULL,
    license_expiry date NOT NULL,
    license_type character varying(255),
    total_deliveries integer,
    completed_deliveries integer DEFAULT 0,
    returned_deliveries integer DEFAULT 0,
    average_delivery_time numeric(10,2),
    rating numeric(3,2),
    total_reviews integer DEFAULT 0,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    verified_at timestamp with time zone,
    CONSTRAINT delivery_persons_vehicle_type_check CHECK ((vehicle_type = ANY (ARRAY['motorcycle'::text, 'bicycle'::text, 'car'::text, 'van'::text])))
);


ALTER TABLE public.delivery_persons OWNER TO jefjel_owner;

--
-- Name: delivery_persons_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.delivery_persons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_persons_id_seq OWNER TO jefjel_owner;

--
-- Name: delivery_persons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.delivery_persons_id_seq OWNED BY public.delivery_persons.id;


--
-- Name: delivery_zones; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.delivery_zones (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    name character varying(255),
    fee numeric(10,2) NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.delivery_zones OWNER TO jefjel_owner;

--
-- Name: delivery_zones_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.delivery_zones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_zones_id_seq OWNER TO jefjel_owner;

--
-- Name: delivery_zones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.delivery_zones_id_seq OWNED BY public.delivery_zones.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    product_id integer NOT NULL,
    tenant_id integer NOT NULL,
    quantity integer DEFAULT 0,
    reorder_point integer DEFAULT 0,
    reorder_quantity integer DEFAULT 0,
    low_stock_threshold integer DEFAULT 0,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    reserved_quantity integer DEFAULT 0
);


ALTER TABLE public.inventory OWNER TO jefjel_owner;

--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_id_seq OWNER TO jefjel_owner;

--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- Name: menu_item_permissions; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.menu_item_permissions (
    id integer NOT NULL,
    menu_item_id integer,
    permission_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.menu_item_permissions OWNER TO jefjel_owner;

--
-- Name: menu_item_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.menu_item_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_item_permissions_id_seq OWNER TO jefjel_owner;

--
-- Name: menu_item_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.menu_item_permissions_id_seq OWNED BY public.menu_item_permissions.id;


--
-- Name: menu_items; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    label character varying(255) NOT NULL,
    route character varying(255),
    icon character varying(255),
    parent_id integer,
    tenant_id integer,
    "order" integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true,
    is_internal boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.menu_items OWNER TO jefjel_owner;

--
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.menu_items_id_seq OWNER TO jefjel_owner;

--
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    type character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    data json,
    user_id integer,
    tenant_id integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    is_read boolean DEFAULT false
);


ALTER TABLE public.notifications OWNER TO jefjel_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO jefjel_owner;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.order_items OWNER TO jefjel_owner;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO jefjel_owner;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    tenant_id integer NOT NULL,
    payment_method character varying(255),
    subtotal numeric(10,2) NOT NULL,
    delivery_fee numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    address_id integer,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT orders_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])))
);


ALTER TABLE public.orders OWNER TO jefjel_owner;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO jefjel_owner;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer NOT NULL,
    payment_method character varying(255) NOT NULL,
    status text DEFAULT 'pending'::text,
    transaction_id character varying(255),
    amount numeric(10,2) NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT payments_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'success'::text, 'failed'::text, 'refunded'::text])))
);


ALTER TABLE public.payments OWNER TO jefjel_owner;

--
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_id_seq OWNER TO jefjel_owner;

--
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.permissions (
    id integer NOT NULL,
    resource character varying(255) NOT NULL,
    action character varying(255) NOT NULL,
    tenant_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    resource_id integer,
    scope public.permission_scope DEFAULT 'all'::public.permission_scope NOT NULL
);


ALTER TABLE public.permissions OWNER TO jefjel_owner;

--
-- Name: permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissions_id_seq OWNER TO jefjel_owner;

--
-- Name: permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;


--
-- Name: product_images; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.product_images (
    id integer NOT NULL,
    url character varying(255) NOT NULL,
    filename character varying(255) NOT NULL,
    alt_text character varying(255),
    is_cover boolean DEFAULT false,
    display_order integer DEFAULT 0,
    product_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.product_images OWNER TO jefjel_owner;

--
-- Name: product_images_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.product_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_images_id_seq OWNER TO jefjel_owner;

--
-- Name: product_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.product_images_id_seq OWNED BY public.product_images.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    sku character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    tenant_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_marketplace_visible boolean DEFAULT true,
    marketplace_priority integer DEFAULT 0,
    average_rating numeric(3,2) DEFAULT '0'::numeric
);


ALTER TABLE public.products OWNER TO jefjel_owner;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO jefjel_owner;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: resources; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.resources (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    available_actions json DEFAULT '["create","read","update","delete"]'::json NOT NULL,
    tenant_id integer,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.resources OWNER TO jefjel_owner;

--
-- Name: resources_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resources_id_seq OWNER TO jefjel_owner;

--
-- Name: resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.resources_id_seq OWNED BY public.resources.id;


--
-- Name: role_permission; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.role_permission (
    id integer NOT NULL,
    role_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.role_permission OWNER TO jefjel_owner;

--
-- Name: role_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.role_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.role_permission_id_seq OWNER TO jefjel_owner;

--
-- Name: role_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.role_permission_id_seq OWNED BY public.role_permission.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    tenant_id integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.roles OWNER TO jefjel_owner;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO jefjel_owner;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.tenants (
    id integer NOT NULL,
    slug character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    domain character varying(255) NOT NULL,
    description character varying(255),
    status text DEFAULT 'pending'::text NOT NULL,
    rating numeric(2,1) DEFAULT '0'::numeric,
    logo character varying(255),
    cover_image character varying(255),
    product_count integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tenants_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'pending'::text])))
);


ALTER TABLE public.tenants OWNER TO jefjel_owner;

--
-- Name: tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.tenants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenants_id_seq OWNER TO jefjel_owner;

--
-- Name: tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.tenants_id_seq OWNED BY public.tenants.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.user_profiles (
    id integer NOT NULL,
    user_id integer,
    bio character varying(255),
    phone character varying(255),
    avatar_url character varying(255),
    website character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.user_profiles OWNER TO jefjel_owner;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.user_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_profiles_id_seq OWNER TO jefjel_owner;

--
-- Name: user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.user_profiles_id_seq OWNED BY public.user_profiles.id;


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.user_roles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_roles OWNER TO jefjel_owner;

--
-- Name: user_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.user_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_roles_id_seq OWNER TO jefjel_owner;

--
-- Name: user_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.user_roles_id_seq OWNED BY public.user_roles.id;


--
-- Name: user_tenants; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.user_tenants (
    id integer NOT NULL,
    user_id integer NOT NULL,
    tenant_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_tenants OWNER TO jefjel_owner;

--
-- Name: user_tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.user_tenants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_tenants_id_seq OWNER TO jefjel_owner;

--
-- Name: user_tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.user_tenants_id_seq OWNED BY public.user_tenants.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text, 'suspended'::text, 'pending'::text])))
);


ALTER TABLE public.users OWNER TO jefjel_owner;

--
-- Name: users_addresses; Type: TABLE; Schema: public; Owner: jefjel_owner
--

CREATE TABLE public.users_addresses (
    id integer NOT NULL,
    user_id integer NOT NULL,
    address_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users_addresses OWNER TO jefjel_owner;

--
-- Name: users_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.users_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_addresses_id_seq OWNER TO jefjel_owner;

--
-- Name: users_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.users_addresses_id_seq OWNED BY public.users_addresses.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: jefjel_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO jefjel_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jefjel_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- Name: adonis_schema id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.adonis_schema ALTER COLUMN id SET DEFAULT nextval('public.adonis_schema_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: category_products id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.category_products ALTER COLUMN id SET DEFAULT nextval('public.category_products_id_seq'::regclass);


--
-- Name: deliveries id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.deliveries ALTER COLUMN id SET DEFAULT nextval('public.deliveries_id_seq'::regclass);


--
-- Name: delivery_person_zones id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_person_zones ALTER COLUMN id SET DEFAULT nextval('public.delivery_person_zones_id_seq'::regclass);


--
-- Name: delivery_persons id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_persons ALTER COLUMN id SET DEFAULT nextval('public.delivery_persons_id_seq'::regclass);


--
-- Name: delivery_zones id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_zones ALTER COLUMN id SET DEFAULT nextval('public.delivery_zones_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: menu_item_permissions id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.menu_item_permissions ALTER COLUMN id SET DEFAULT nextval('public.menu_item_permissions_id_seq'::regclass);


--
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- Name: permissions id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);


--
-- Name: product_images id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.product_images ALTER COLUMN id SET DEFAULT nextval('public.product_images_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: resources id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.resources ALTER COLUMN id SET DEFAULT nextval('public.resources_id_seq'::regclass);


--
-- Name: role_permission id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.role_permission ALTER COLUMN id SET DEFAULT nextval('public.role_permission_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: tenants id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.tenants ALTER COLUMN id SET DEFAULT nextval('public.tenants_id_seq'::regclass);


--
-- Name: user_profiles id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_profiles_id_seq'::regclass);


--
-- Name: user_roles id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_roles ALTER COLUMN id SET DEFAULT nextval('public.user_roles_id_seq'::regclass);


--
-- Name: user_tenants id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_tenants ALTER COLUMN id SET DEFAULT nextval('public.user_tenants_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: users_addresses id; Type: DEFAULT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.users_addresses ALTER COLUMN id SET DEFAULT nextval('public.users_addresses_id_seq'::regclass);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.addresses (id, type, address_line1, address_line2, city, state, country, postal_code, phone, is_default, tenant_id, zone_id, created_at, updated_at) FROM stdin;
1	shipping	Fass, Dakar	\N	Dakar	\N	Sénégal	12500	769335669	f	1	2	2025-01-17 15:08:01.322+00	2025-01-17 15:08:01.651+00
2	shipping	Fass, Dakar	\N	Dakar	\N	Sénégal	12500	\N	t	1	2	2025-01-20 12:30:20.894+00	2025-02-07 12:41:39.262+00
\.


--
-- Data for Name: adonis_schema; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.adonis_schema (id, name, batch, migration_time) FROM stdin;
88	database/migrations/1731933440045_create_users_table	1	2025-01-16 14:54:50.683777+00
89	database/migrations/1731933445045_create_tenants_table	1	2025-01-16 14:54:51.461398+00
90	database/migrations/1731933450060_create_user_tenants_table	1	2025-01-16 14:54:52.140747+00
91	database/migrations/1731934399743_create_roles_table	1	2025-01-16 14:54:53.096055+00
92	database/migrations/1731934414554_create_permissions_table	1	2025-01-16 14:54:53.726101+00
93	database/migrations/1731934432328_create_role_permissions_table	1	2025-01-16 14:54:54.582724+00
94	database/migrations/1731947302488_create_user_roles_table	1	2025-01-16 14:54:55.498254+00
95	database/migrations/1733142614520_create_menu_items_table	1	2025-01-16 14:54:56.364711+00
96	database/migrations/1733143757044_create_menu_item_permissions_table	1	2025-01-16 14:54:56.936157+00
97	database/migrations/1734432987657_create_products_table	1	2025-01-16 14:54:57.624928+00
98	database/migrations/1734433008833_create_categories_table	1	2025-01-16 14:54:58.75726+00
99	database/migrations/1734434417062_create_user_profiles_table	1	2025-01-16 14:54:59.860042+00
100	database/migrations/1734435594908_create_delivery_zones_table	1	2025-01-16 14:55:00.549475+00
101	database/migrations/1734435594909_create_addresses_table	1	2025-01-16 14:55:01.297601+00
102	database/migrations/1734439732278_create_product_images_table	1	2025-01-16 14:55:01.868761+00
103	database/migrations/1734440945400_create_users_addresses_table	1	2025-01-16 14:55:02.96238+00
104	database/migrations/1734446941562_create_category_products_table	1	2025-01-16 14:55:03.94636+00
105	database/migrations/1735302870119_create_inventory_table	1	2025-01-16 14:55:04.69491+00
106	database/migrations/1735647020770_create_orders_table	1	2025-01-16 14:55:08.652692+00
107	database/migrations/1735647020775_create_payments_table	1	2025-01-16 14:55:10.415172+00
108	database/migrations/1735647493506_create_order_items_table	1	2025-01-16 14:55:11.203438+00
109	database/migrations/1735819892757_create_carts_table	1	2025-01-16 14:55:12.453557+00
110	database/migrations/1735821040845_create_cart_items_table	1	2025-01-16 14:55:13.162269+00
111	database/migrations/1737554083003_create_notifications_table	2	2025-01-24 11:23:45.575011+00
112	database/migrations/1703_user_profiles	3	2025-02-07 13:02:49.275803+00
113	database/migrations/1739186539827_create_deliveries_table	4	2025-02-20 14:55:29.573649+00
114	database/migrations/1739364713576_create_delivery_people_table	4	2025-02-20 14:55:30.370832+00
115	database/migrations/1739446106547_create_delivery_person_zones_table	4	2025-02-20 14:55:31.463811+00
116	database/migrations/1739964577571_create_resources_table	4	2025-02-20 14:55:32.350036+00
\.


--
-- Data for Name: adonis_schema_versions; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.adonis_schema_versions (version) FROM stdin;
2
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.cart_items (id, cart_id, tenant_id, product_id, quantity, created_at, updated_at) FROM stdin;
2	1	3	54	1	2025-01-17 12:25:28.578+00	2025-01-17 12:25:28.579+00
3	1	3	53	1	2025-01-17 12:25:33.777+00	2025-01-17 12:25:33.777+00
1	1	3	55	3	2025-01-17 12:20:03.923+00	2025-01-17 12:25:35.185+00
4	2	4	205	1	2025-01-17 16:37:02.507+00	2025-01-17 16:37:02.507+00
5	3	3	55	1	2025-01-20 11:39:44.119+00	2025-01-20 11:39:44.119+00
6	3	3	54	2	2025-01-20 11:39:44.731+00	2025-01-20 11:40:51.712+00
7	4	3	55	1	2025-01-20 12:23:50.054+00	2025-01-20 12:23:50.055+00
8	5	5	228	1	2025-01-20 12:30:34.723+00	2025-01-20 12:30:34.723+00
9	5	5	231	1	2025-01-20 12:30:35.498+00	2025-01-20 12:30:35.498+00
10	5	5	227	1	2025-01-20 12:30:39.978+00	2025-01-20 12:30:39.978+00
11	6	4	200	1	2025-01-20 14:31:36.142+00	2025-01-20 14:31:36.142+00
12	6	2	128	2	2025-01-20 14:37:37.906+00	2025-01-20 14:37:37.906+00
13	6	2	129	1	2025-01-20 14:37:37.966+00	2025-01-20 14:37:37.967+00
14	7	5	228	2	2025-01-21 12:34:55.169+00	2025-01-21 12:34:55.338+00
18	8	2	127	1	2025-01-24 13:27:00.909+00	2025-01-24 13:27:00.909+00
17	8	2	129	2	2025-01-24 13:27:00.883+00	2025-01-24 13:27:01.416+00
20	9	5	228	1	2025-01-27 11:35:13.956+00	2025-01-27 11:35:13.958+00
21	9	5	231	1	2025-01-27 11:35:14.057+00	2025-01-27 11:35:14.058+00
22	10	3	54	1	2025-01-27 13:44:02.433+00	2025-01-27 13:44:02.466+00
23	10	3	55	1	2025-01-27 13:44:03.911+00	2025-01-27 13:44:03.911+00
24	11	3	55	1	2025-01-29 12:06:12.713+00	2025-01-29 12:06:12.714+00
25	11	3	54	1	2025-01-29 12:06:15.081+00	2025-01-29 12:06:15.081+00
26	12	2	129	1	2025-01-29 12:58:35.935+00	2025-01-29 12:58:35.935+00
27	12	2	128	1	2025-01-29 12:58:36.979+00	2025-01-29 12:58:36.979+00
28	13	4	200	1	2025-01-29 13:06:44.56+00	2025-01-29 13:06:44.56+00
29	13	4	202	2	2025-01-29 13:06:47.354+00	2025-01-29 13:06:47.9+00
30	14	2	129	2	2025-02-04 12:10:13.342+00	2025-02-04 12:10:13.911+00
31	14	2	128	1	2025-02-04 12:10:14.27+00	2025-02-04 12:10:14.271+00
32	15	5	228	1	2025-02-04 12:20:07.852+00	2025-02-04 12:20:07.852+00
33	16	5	228	2	2025-02-04 12:20:07.843+00	2025-02-04 12:20:29.494+00
35	18	3	55	1	2025-02-05 11:43:23.119+00	2025-02-05 11:43:23.119+00
34	17	3	55	2	2025-02-05 11:43:23.107+00	2025-02-05 11:43:23.231+00
36	17	3	54	6	2025-02-05 11:43:23.847+00	2025-02-05 14:09:22.468+00
37	19	5	228	2	2025-02-06 13:58:05.145+00	2025-02-06 13:58:07.477+00
38	20	5	228	1	2025-03-03 16:47:08.377+00	2025-03-03 16:47:08.377+00
39	20	5	228	1	2025-03-03 16:47:08.386+00	2025-03-03 16:47:08.386+00
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.carts (id, user_id, tenant_id, status, created_at, updated_at) FROM stdin;
1	16	1	ordered	2025-01-16 16:16:52.203+00	2025-01-17 16:35:31.747+00
2	16	1	ordered	2025-01-17 16:37:01.511+00	2025-01-17 16:39:40.821+00
3	16	1	ordered	2025-01-20 11:39:41.897+00	2025-01-20 12:17:07.549+00
4	16	1	ordered	2025-01-20 12:23:49.111+00	2025-01-20 12:30:21.552+00
5	16	1	ordered	2025-01-20 12:30:33.899+00	2025-01-20 13:31:20.424+00
6	16	1	ordered	2025-01-20 14:31:35.096+00	2025-01-20 14:37:51.337+00
7	16	1	ordered	2025-01-21 12:34:53.25+00	2025-01-21 12:35:48.813+00
8	16	1	ordered	2025-01-24 13:26:55.512+00	2025-01-24 13:31:49.162+00
9	16	1	ordered	2025-01-27 11:35:10.867+00	2025-01-27 12:07:34.095+00
10	17	1	ordered	2025-01-27 13:43:59.641+00	2025-01-27 13:44:40.376+00
11	17	1	ordered	2025-01-29 12:06:11.523+00	2025-01-29 12:07:16.237+00
12	17	1	ordered	2025-01-29 12:58:34.919+00	2025-01-29 12:59:07.294+00
13	17	1	ordered	2025-01-29 13:06:43.616+00	2025-01-29 13:07:05.549+00
14	17	1	ordered	2025-02-04 12:10:11.791+00	2025-02-04 12:10:42.958+00
16	17	1	ordered	2025-02-04 12:20:06.83+00	2025-02-04 12:20:50.556+00
15	17	1	ordered	2025-02-04 12:20:06.787+00	2025-02-05 11:42:32.901+00
18	17	1	ordered	2025-02-05 11:43:22.064+00	2025-02-05 11:43:50.266+00
17	17	1	ordered	2025-02-05 11:43:22+00	2025-02-06 13:03:40.257+00
19	17	1	ordered	2025-02-06 13:58:03.684+00	2025-02-06 13:58:26.198+00
20	16	1	active	2025-03-03 16:47:07.502+00	2025-03-03 16:47:07.502+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.categories (id, name, description, icon, parent_id, tenant_id, created_at, updated_at) FROM stdin;
10	Smartphones	New indigo Car with ergonomic design for carefree comfort	smartphone	\N	2	2025-01-16 15:50:45.275+00	2025-01-16 15:50:45.276+00
11	Laptops	New Tuna model with 49 GB RAM, 108 GB storage, and joyous features	laptop	\N	2	2025-01-16 15:50:45.413+00	2025-01-16 15:50:45.413+00
12	Audio	The sleek and inconsequential Salad comes with silver LED lighting for smart functionality	headphones	\N	2	2025-01-16 15:50:45.511+00	2025-01-16 15:50:45.512+00
13	Accessories	The Reagan Salad is the latest in a series of enraged products from Christiansen, Wiegand and Schuster	devices_other	\N	2	2025-01-16 15:50:45.604+00	2025-01-16 15:50:45.604+00
14	Men's Wear	Experience the cyan brilliance of our Gloves, perfect for likely environments	man	\N	3	2025-01-16 15:51:21.364+00	2025-01-16 15:51:21.364+00
15	Women's Wear	Our golden-inspired Salad brings a taste of luxury to your aged lifestyle	woman	\N	3	2025-01-16 15:51:21.451+00	2025-01-16 15:51:21.451+00
16	Accessories	Discover the kangaroo-like agility of our Fish, perfect for firm users	watch	\N	3	2025-01-16 15:51:21.538+00	2025-01-16 15:51:21.538+00
17	Shoes	New Bike model with 20 GB RAM, 601 GB storage, and sugary features	accessibility	\N	3	2025-01-16 15:51:21.622+00	2025-01-16 15:51:21.623+00
18	Furniture	New salmon Towels with ergonomic design for flowery comfort	chair	\N	4	2025-01-16 15:51:44.495+00	2025-01-16 15:51:44.495+00
19	Decor	Stylish Shoes designed to make you stand out with discrete looks	decoration	\N	4	2025-01-16 15:51:44.58+00	2025-01-16 15:51:44.58+00
20	Kitchen	The sleek and deserted Pants comes with lime LED lighting for smart functionality	kitchen	\N	4	2025-01-16 15:51:44.659+00	2025-01-16 15:51:44.659+00
21	Lighting	Discover the runny new Gloves with an exciting mix of Soft ingredients	light	\N	4	2025-01-16 15:51:44.738+00	2025-01-16 15:51:44.738+00
22	Fitness	Smith - Effertz's most advanced Chips technology increases respectful capabilities	fitness_center	\N	5	2025-01-16 15:52:05.996+00	2025-01-16 15:52:05.996+00
23	Team Sports	The sleek and sarcastic Bike comes with pink LED lighting for smart functionality	sports_soccer	\N	5	2025-01-16 15:52:06.086+00	2025-01-16 15:52:06.086+00
24	Outdoor	Featuring Aluminium-enhanced technology, our Pants offers unparalleled annual performance	terrain	\N	5	2025-01-16 15:52:06.174+00	2025-01-16 15:52:06.174+00
25	Equipment	The Blanca Chips is the latest in a series of agile products from Vandervort LLC	sports	\N	5	2025-01-16 15:52:06.262+00	2025-01-16 15:52:06.262+00
\.


--
-- Data for Name: category_products; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.category_products (id, category_id, product_id) FROM stdin;
\.


--
-- Data for Name: deliveries; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.deliveries (id, order_id, delivery_person_id, notes, assigned_at, picked_at, delivered_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: delivery_person_zones; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.delivery_person_zones (id, delivery_person_id, zone_id, is_active, created_at, updated_at) FROM stdin;
4	1	2	t	2025-03-04 11:50:34.709+00	2025-03-04 11:50:34.709+00
3	1	16	t	2025-03-04 11:50:34.709+00	2025-03-04 11:50:34.709+00
5	2	1	t	2025-03-04 11:54:04.922+00	2025-03-04 11:54:04.922+00
\.


--
-- Data for Name: delivery_persons; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.delivery_persons (id, user_id, tenant_id, is_active, is_available, last_active_at, last_delivery_at, vehicle_type, vehicle_plate_number, vehicle_model, vehicle_year, license_number, license_expiry, license_type, total_deliveries, completed_deliveries, returned_deliveries, average_delivery_time, rating, total_reviews, notes, created_at, updated_at, verified_at) FROM stdin;
1	26	1	t	t	\N	\N	motorcycle	fdsfdsf	honda	2012	DFSFDS	2027-08-28	A	\N	0	0	\N	\N	0	\N	2025-03-04 02:20:36.22+00	2025-03-04 02:20:36.221+00	\N
2	21	1	t	t	\N	\N	motorcycle	ABC123	Honda CB150R	2022	DL12345	2025-12-31	A	\N	0	0	\N	\N	0	\N	2025-03-04 10:46:07.457+00	2025-03-04 10:46:07.457+00	\N
\.


--
-- Data for Name: delivery_zones; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.delivery_zones (id, tenant_id, name, fee, created_at, updated_at) FROM stdin;
1	1	Amitité I	1500.00	2025-01-16 15:13:27.215+00	2025-01-16 15:13:27.216+00
2	1	Fass	1000.00	2025-01-16 15:13:27.234+00	2025-01-16 15:13:27.234+00
4	1	Point E	1500.00	2025-01-16 15:13:27.239+00	2025-01-16 15:13:27.239+00
5	1	Plateau	1500.00	2025-01-16 15:13:27.241+00	2025-01-16 15:13:27.242+00
6	1	Mermoz	2000.00	2025-01-16 15:13:27.245+00	2025-01-16 15:13:27.245+00
7	1	Ouakam	2500.00	2025-01-16 15:13:27.246+00	2025-01-16 15:13:27.246+00
8	1	Ngor	3000.00	2025-01-16 15:13:27.249+00	2025-01-16 15:13:27.249+00
9	1	Yoff	2500.00	2025-01-16 15:13:27.25+00	2025-01-16 15:13:27.25+00
10	1	Guediawaye	4000.00	2025-01-16 15:13:27.258+00	2025-01-16 15:13:27.258+00
12	1	Medina	1500.00	2025-01-16 15:13:27.254+00	2025-01-16 15:13:27.254+00
15	1	Pikine	3500.00	2025-01-16 15:13:27.257+00	2025-01-16 15:13:27.257+00
13	1	Fann	1500.00	2025-01-16 15:13:27.255+00	2025-01-16 15:13:27.255+00
11	1	Sacré Coeur	2000.00	2025-01-16 15:13:27.253+00	2025-01-16 15:13:27.253+00
16	1	Grand Dakar	2000.00	2025-01-16 15:13:27.256+00	2025-01-16 15:13:27.256+00
14	1	HLM	2000.00	2025-01-16 15:13:27.256+00	2025-01-16 15:13:27.256+00
17	1	Rufisque	4500.00	2025-01-16 15:13:27.258+00	2025-01-16 15:13:27.258+00
18	2	Almadies	2000.00	2025-01-16 15:13:28.137+00	2025-01-16 15:13:28.137+00
19	2	Ouakam	2500.00	2025-01-16 15:13:28.139+00	2025-01-16 15:13:28.139+00
20	2	Yoff	2500.00	2025-01-16 15:13:28.14+00	2025-01-16 15:13:28.14+00
21	2	Ngor	3000.00	2025-01-16 15:13:28.14+00	2025-01-16 15:13:28.14+00
22	2	Mermoz	2000.00	2025-01-16 15:13:28.139+00	2025-01-16 15:13:28.139+00
23	2	Fass	1000.00	2025-01-16 15:13:28.137+00	2025-01-16 15:13:28.137+00
24	2	Plateau	1500.00	2025-01-16 15:13:28.138+00	2025-01-16 15:13:28.138+00
25	2	Sacré Coeur	2000.00	2025-01-16 15:13:28.141+00	2025-01-16 15:13:28.141+00
26	2	Amitité I	1500.00	2025-01-16 15:13:28.136+00	2025-01-16 15:13:28.136+00
27	2	Point E	1500.00	2025-01-16 15:13:28.138+00	2025-01-16 15:13:28.138+00
28	2	Medina	1500.00	2025-01-16 15:13:28.141+00	2025-01-16 15:13:28.141+00
29	2	Grand Dakar	2000.00	2025-01-16 15:13:28.143+00	2025-01-16 15:13:28.143+00
30	2	Guediawaye	4000.00	2025-01-16 15:13:28.144+00	2025-01-16 15:13:28.145+00
31	2	HLM	2000.00	2025-01-16 15:13:28.142+00	2025-01-16 15:13:28.142+00
32	2	Rufisque	4500.00	2025-01-16 15:13:28.145+00	2025-01-16 15:13:28.145+00
33	2	Fann	1500.00	2025-01-16 15:13:28.142+00	2025-01-16 15:13:28.142+00
34	2	Pikine	3500.00	2025-01-16 15:13:28.143+00	2025-01-16 15:13:28.143+00
35	3	Point E	1500.00	2025-01-16 15:13:28.371+00	2025-01-16 15:13:28.371+00
36	3	Mermoz	2000.00	2025-01-16 15:13:28.373+00	2025-01-16 15:13:28.373+00
37	3	Ouakam	2500.00	2025-01-16 15:13:28.374+00	2025-01-16 15:13:28.374+00
38	3	Fass	1000.00	2025-01-16 15:13:28.37+00	2025-01-16 15:13:28.37+00
39	3	Sacré Coeur	2000.00	2025-01-16 15:13:28.378+00	2025-01-16 15:13:28.378+00
40	3	Plateau	1500.00	2025-01-16 15:13:28.372+00	2025-01-16 15:13:28.372+00
41	3	Ngor	3000.00	2025-01-16 15:13:28.375+00	2025-01-16 15:13:28.375+00
42	3	Amitité I	1500.00	2025-01-16 15:13:28.368+00	2025-01-16 15:13:28.369+00
43	3	Almadies	2000.00	2025-01-16 15:13:28.37+00	2025-01-16 15:13:28.371+00
44	3	Yoff	2500.00	2025-01-16 15:13:28.376+00	2025-01-16 15:13:28.376+00
45	3	Medina	1500.00	2025-01-16 15:13:28.379+00	2025-01-16 15:13:28.379+00
46	3	Fann	1500.00	2025-01-16 15:13:28.38+00	2025-01-16 15:13:28.38+00
47	3	Grand Dakar	2000.00	2025-01-16 15:13:28.381+00	2025-01-16 15:13:28.381+00
48	3	HLM	2000.00	2025-01-16 15:13:28.381+00	2025-01-16 15:13:28.381+00
49	3	Guediawaye	4000.00	2025-01-16 15:13:28.384+00	2025-01-16 15:13:28.384+00
50	3	Pikine	3500.00	2025-01-16 15:13:28.383+00	2025-01-16 15:13:28.383+00
51	3	Rufisque	4500.00	2025-01-16 15:13:28.385+00	2025-01-16 15:13:28.385+00
52	4	Fass	1000.00	2025-01-16 15:13:28.626+00	2025-01-16 15:13:28.626+00
53	4	Ouakam	2500.00	2025-01-16 15:13:28.63+00	2025-01-16 15:13:28.631+00
54	4	Point E	1500.00	2025-01-16 15:13:28.628+00	2025-01-16 15:13:28.628+00
55	4	Plateau	1500.00	2025-01-16 15:13:28.629+00	2025-01-16 15:13:28.629+00
56	4	Amitité I	1500.00	2025-01-16 15:13:28.625+00	2025-01-16 15:13:28.625+00
57	4	Ngor	3000.00	2025-01-16 15:13:28.631+00	2025-01-16 15:13:28.631+00
58	4	Sacré Coeur	2000.00	2025-01-16 15:13:28.633+00	2025-01-16 15:13:28.633+00
59	4	Yoff	2500.00	2025-01-16 15:13:28.632+00	2025-01-16 15:13:28.632+00
60	4	Almadies	2000.00	2025-01-16 15:13:28.627+00	2025-01-16 15:13:28.627+00
61	4	Mermoz	2000.00	2025-01-16 15:13:28.629+00	2025-01-16 15:13:28.629+00
62	4	Medina	1500.00	2025-01-16 15:13:28.634+00	2025-01-16 15:13:28.634+00
63	4	HLM	2000.00	2025-01-16 15:13:28.635+00	2025-01-16 15:13:28.635+00
64	4	Grand Dakar	2000.00	2025-01-16 15:13:28.636+00	2025-01-16 15:13:28.636+00
65	4	Pikine	3500.00	2025-01-16 15:13:28.637+00	2025-01-16 15:13:28.637+00
66	4	Fann	1500.00	2025-01-16 15:13:28.635+00	2025-01-16 15:13:28.635+00
67	4	Guediawaye	4000.00	2025-01-16 15:13:28.638+00	2025-01-16 15:13:28.638+00
68	4	Rufisque	4500.00	2025-01-16 15:13:28.639+00	2025-01-16 15:13:28.639+00
69	5	Plateau	1500.00	2025-01-16 15:13:28.864+00	2025-01-16 15:13:28.864+00
70	5	Ouakam	2500.00	2025-01-16 15:13:28.865+00	2025-01-16 15:13:28.866+00
71	5	Mermoz	2000.00	2025-01-16 15:13:28.865+00	2025-01-16 15:13:28.865+00
72	5	Almadies	2000.00	2025-01-16 15:13:28.863+00	2025-01-16 15:13:28.863+00
73	5	Yoff	2500.00	2025-01-16 15:13:28.868+00	2025-01-16 15:13:28.868+00
74	5	Point E	1500.00	2025-01-16 15:13:28.863+00	2025-01-16 15:13:28.863+00
75	5	Amitité I	1500.00	2025-01-16 15:13:28.861+00	2025-01-16 15:13:28.861+00
76	5	Ngor	3000.00	2025-01-16 15:13:28.866+00	2025-01-16 15:13:28.866+00
77	5	Sacré Coeur	2000.00	2025-01-16 15:13:28.869+00	2025-01-16 15:13:28.869+00
78	5	Fass	1000.00	2025-01-16 15:13:28.862+00	2025-01-16 15:13:28.862+00
79	5	Medina	1500.00	2025-01-16 15:13:28.87+00	2025-01-16 15:13:28.87+00
80	5	Fann	1500.00	2025-01-16 15:13:28.871+00	2025-01-16 15:13:28.871+00
81	5	HLM	2000.00	2025-01-16 15:13:28.872+00	2025-01-16 15:13:28.872+00
82	5	Pikine	3500.00	2025-01-16 15:13:28.873+00	2025-01-16 15:13:28.873+00
83	5	Grand Dakar	2000.00	2025-01-16 15:13:28.873+00	2025-01-16 15:13:28.873+00
84	5	Rufisque	4500.00	2025-01-16 15:13:28.875+00	2025-01-16 15:13:28.875+00
85	5	Guediawaye	4000.00	2025-01-16 15:13:28.874+00	2025-01-16 15:13:28.875+00
86	6	Mermoz	2000.00	2025-01-16 15:13:29.115+00	2025-01-16 15:13:29.115+00
87	6	Ouakam	2500.00	2025-01-16 15:13:29.116+00	2025-01-16 15:13:29.116+00
88	6	Point E	1500.00	2025-01-16 15:13:29.113+00	2025-01-16 15:13:29.113+00
89	6	Plateau	1500.00	2025-01-16 15:13:29.114+00	2025-01-16 15:13:29.114+00
90	6	Amitité I	1500.00	2025-01-16 15:13:29.11+00	2025-01-16 15:13:29.11+00
91	6	Almadies	2000.00	2025-01-16 15:13:29.112+00	2025-01-16 15:13:29.112+00
92	6	Fass	1000.00	2025-01-16 15:13:29.111+00	2025-01-16 15:13:29.111+00
93	6	Yoff	2500.00	2025-01-16 15:13:29.118+00	2025-01-16 15:13:29.119+00
94	6	Sacré Coeur	2000.00	2025-01-16 15:13:29.12+00	2025-01-16 15:13:29.12+00
95	6	Ngor	3000.00	2025-01-16 15:13:29.117+00	2025-01-16 15:13:29.117+00
96	6	Medina	1500.00	2025-01-16 15:13:29.121+00	2025-01-16 15:13:29.121+00
97	6	HLM	2000.00	2025-01-16 15:13:29.122+00	2025-01-16 15:13:29.122+00
98	6	Fann	1500.00	2025-01-16 15:13:29.121+00	2025-01-16 15:13:29.122+00
99	6	Grand Dakar	2000.00	2025-01-16 15:13:29.122+00	2025-01-16 15:13:29.123+00
100	6	Guediawaye	4000.00	2025-01-16 15:13:29.123+00	2025-01-16 15:13:29.124+00
101	6	Rufisque	4500.00	2025-01-16 15:13:29.124+00	2025-01-16 15:13:29.124+00
102	6	Pikine	3500.00	2025-01-16 15:13:29.123+00	2025-01-16 15:13:29.123+00
103	7	Point E	1500.00	2025-01-16 15:13:29.34+00	2025-01-16 15:13:29.34+00
104	7	Yoff	2500.00	2025-01-16 15:13:29.343+00	2025-01-16 15:13:29.343+00
105	7	Plateau	1500.00	2025-01-16 15:13:29.341+00	2025-01-16 15:13:29.341+00
106	7	Sacré Coeur	2000.00	2025-01-16 15:13:29.343+00	2025-01-16 15:13:29.343+00
107	7	Fass	1000.00	2025-01-16 15:13:29.339+00	2025-01-16 15:13:29.339+00
108	7	Mermoz	2000.00	2025-01-16 15:13:29.341+00	2025-01-16 15:13:29.341+00
109	7	Ngor	3000.00	2025-01-16 15:13:29.342+00	2025-01-16 15:13:29.342+00
110	7	Amitité I	1500.00	2025-01-16 15:13:29.338+00	2025-01-16 15:13:29.338+00
111	7	Almadies	2000.00	2025-01-16 15:13:29.34+00	2025-01-16 15:13:29.34+00
112	7	Ouakam	2500.00	2025-01-16 15:13:29.342+00	2025-01-16 15:13:29.342+00
113	7	Medina	1500.00	2025-01-16 15:13:29.344+00	2025-01-16 15:13:29.344+00
114	7	Pikine	3500.00	2025-01-16 15:13:29.346+00	2025-01-16 15:13:29.346+00
115	7	Grand Dakar	2000.00	2025-01-16 15:13:29.345+00	2025-01-16 15:13:29.345+00
116	7	Fann	1500.00	2025-01-16 15:13:29.344+00	2025-01-16 15:13:29.344+00
117	7	HLM	2000.00	2025-01-16 15:13:29.345+00	2025-01-16 15:13:29.345+00
118	7	Guediawaye	4000.00	2025-01-16 15:13:29.346+00	2025-01-16 15:13:29.346+00
119	7	Rufisque	4500.00	2025-01-16 15:13:29.347+00	2025-01-16 15:13:29.347+00
129	8	Amitité I	1500.00	2025-01-16 15:13:29.552+00	2025-01-16 15:13:29.552+00
135	8	Fann	1500.00	2025-01-16 15:13:29.557+00	2025-01-16 15:13:29.557+00
141	9	Mermoz	2000.00	2025-01-16 15:13:29.859+00	2025-01-16 15:13:29.859+00
149	9	Fann	1500.00	2025-01-16 15:13:29.866+00	2025-01-16 15:13:29.866+00
158	10	Point E	1500.00	2025-01-16 15:13:30.181+00	2025-01-16 15:13:30.181+00
168	10	Grand Dakar	2000.00	2025-01-16 15:13:30.188+00	2025-01-16 15:13:30.188+00
174	11	Point E	1500.00	2025-01-16 15:13:30.542+00	2025-01-16 15:13:30.542+00
183	11	Grand Dakar	2000.00	2025-01-16 15:13:30.572+00	2025-01-16 15:13:30.572+00
190	12	Plateau	1500.00	2025-01-16 15:13:30.812+00	2025-01-16 15:13:30.812+00
200	12	HLM	2000.00	2025-01-16 15:13:30.82+00	2025-01-16 15:13:30.82+00
210	13	Mermoz	2000.00	2025-01-16 15:13:31.034+00	2025-01-16 15:13:31.034+00
221	13	Pikine	3500.00	2025-01-16 15:13:31.04+00	2025-01-16 15:13:31.04+00
227	14	Amitité I	1500.00	2025-01-16 15:13:31.256+00	2025-01-16 15:13:31.256+00
237	14	Pikine	3500.00	2025-01-16 15:13:31.263+00	2025-01-16 15:13:31.263+00
241	15	Point E	1500.00	2025-01-16 15:13:31.471+00	2025-01-16 15:13:31.472+00
120	8	Mermoz	2000.00	2025-01-16 15:13:29.554+00	2025-01-16 15:13:29.554+00
136	8	Rufisque	4500.00	2025-01-16 15:13:29.559+00	2025-01-16 15:13:29.559+00
138	9	Amitité I	1500.00	2025-01-16 15:13:29.85+00	2025-01-16 15:13:29.85+00
151	9	Guediawaye	4000.00	2025-01-16 15:13:29.869+00	2025-01-16 15:13:29.869+00
155	10	Almadies	2000.00	2025-01-16 15:13:30.18+00	2025-01-16 15:13:30.18+00
165	10	Medina	1500.00	2025-01-16 15:13:30.186+00	2025-01-16 15:13:30.186+00
172	11	Mermoz	2000.00	2025-01-16 15:13:30.544+00	2025-01-16 15:13:30.544+00
181	11	Medina	1500.00	2025-01-16 15:13:30.559+00	2025-01-16 15:13:30.559+00
192	12	Ouakam	2500.00	2025-01-16 15:13:30.816+00	2025-01-16 15:13:30.816+00
203	12	Guediawaye	4000.00	2025-01-16 15:13:30.821+00	2025-01-16 15:13:30.821+00
205	13	Almadies	2000.00	2025-01-16 15:13:31.03+00	2025-01-16 15:13:31.03+00
215	13	Fann	1500.00	2025-01-16 15:13:31.038+00	2025-01-16 15:13:31.038+00
222	14	Ouakam	2500.00	2025-01-16 15:13:31.259+00	2025-01-16 15:13:31.259+00
232	14	Medina	1500.00	2025-01-16 15:13:31.261+00	2025-01-16 15:13:31.261+00
242	15	Ouakam	2500.00	2025-01-16 15:13:31.473+00	2025-01-16 15:13:31.473+00
251	15	Fann	1500.00	2025-01-16 15:13:31.474+00	2025-01-16 15:13:31.474+00
121	8	Plateau	1500.00	2025-01-16 15:13:29.554+00	2025-01-16 15:13:29.554+00
130	8	Pikine	3500.00	2025-01-16 15:13:29.558+00	2025-01-16 15:13:29.558+00
137	9	Fass	1000.00	2025-01-16 15:13:29.854+00	2025-01-16 15:13:29.854+00
152	9	Pikine	3500.00	2025-01-16 15:13:29.869+00	2025-01-16 15:13:29.869+00
154	10	Fass	1000.00	2025-01-16 15:13:30.176+00	2025-01-16 15:13:30.177+00
166	10	Fann	1500.00	2025-01-16 15:13:30.186+00	2025-01-16 15:13:30.187+00
171	11	Plateau	1500.00	2025-01-16 15:13:30.543+00	2025-01-16 15:13:30.543+00
182	11	Fann	1500.00	2025-01-16 15:13:30.565+00	2025-01-16 15:13:30.566+00
193	12	Mermoz	2000.00	2025-01-16 15:13:30.815+00	2025-01-16 15:13:30.815+00
202	12	Pikine	3500.00	2025-01-16 15:13:30.821+00	2025-01-16 15:13:30.821+00
206	13	Fass	1000.00	2025-01-16 15:13:31.029+00	2025-01-16 15:13:31.029+00
216	13	Medina	1500.00	2025-01-16 15:13:31.037+00	2025-01-16 15:13:31.037+00
223	14	Mermoz	2000.00	2025-01-16 15:13:31.259+00	2025-01-16 15:13:31.259+00
234	14	Fann	1500.00	2025-01-16 15:13:31.261+00	2025-01-16 15:13:31.261+00
240	15	Mermoz	2000.00	2025-01-16 15:13:31.472+00	2025-01-16 15:13:31.472+00
250	15	HLM	2000.00	2025-01-16 15:13:31.475+00	2025-01-16 15:13:31.475+00
122	8	Fass	1000.00	2025-01-16 15:13:29.553+00	2025-01-16 15:13:29.553+00
131	8	Guediawaye	4000.00	2025-01-16 15:13:29.559+00	2025-01-16 15:13:29.559+00
140	9	Ouakam	2500.00	2025-01-16 15:13:29.86+00	2025-01-16 15:13:29.86+00
153	9	Rufisque	4500.00	2025-01-16 15:13:29.87+00	2025-01-16 15:13:29.87+00
157	10	Amitité I	1500.00	2025-01-16 15:13:30.174+00	2025-01-16 15:13:30.174+00
164	10	HLM	2000.00	2025-01-16 15:13:30.187+00	2025-01-16 15:13:30.187+00
177	11	Ouakam	2500.00	2025-01-16 15:13:30.548+00	2025-01-16 15:13:30.548+00
187	11	Rufisque	4500.00	2025-01-16 15:13:30.574+00	2025-01-16 15:13:30.574+00
188	12	Amitité I	1500.00	2025-01-16 15:13:30.81+00	2025-01-16 15:13:30.81+00
198	12	Medina	1500.00	2025-01-16 15:13:30.819+00	2025-01-16 15:13:30.819+00
208	13	Ouakam	2500.00	2025-01-16 15:13:31.034+00	2025-01-16 15:13:31.035+00
218	13	Grand Dakar	2000.00	2025-01-16 15:13:31.04+00	2025-01-16 15:13:31.04+00
225	14	Point E	1500.00	2025-01-16 15:13:31.258+00	2025-01-16 15:13:31.258+00
233	14	HLM	2000.00	2025-01-16 15:13:31.261+00	2025-01-16 15:13:31.262+00
243	15	Plateau	1500.00	2025-01-16 15:13:31.472+00	2025-01-16 15:13:31.472+00
249	15	Medina	1500.00	2025-01-16 15:13:31.474+00	2025-01-16 15:13:31.474+00
123	8	Sacré Coeur	2000.00	2025-01-16 15:13:29.556+00	2025-01-16 15:13:29.556+00
132	8	Medina	1500.00	2025-01-16 15:13:29.556+00	2025-01-16 15:13:29.557+00
139	9	Plateau	1500.00	2025-01-16 15:13:29.859+00	2025-01-16 15:13:29.859+00
163	10	Yoff	2500.00	2025-01-16 15:13:30.185+00	2025-01-16 15:13:30.185+00
178	11	Ngor	3000.00	2025-01-16 15:13:30.551+00	2025-01-16 15:13:30.552+00
194	12	Sacré Coeur	2000.00	2025-01-16 15:13:30.819+00	2025-01-16 15:13:30.819+00
209	13	Yoff	2500.00	2025-01-16 15:13:31.036+00	2025-01-16 15:13:31.036+00
219	13	Guediawaye	4000.00	2025-01-16 15:13:31.041+00	2025-01-16 15:13:31.041+00
224	14	Almadies	2000.00	2025-01-16 15:13:31.258+00	2025-01-16 15:13:31.258+00
235	14	Grand Dakar	2000.00	2025-01-16 15:13:31.262+00	2025-01-16 15:13:31.262+00
239	15	Almadies	2000.00	2025-01-16 15:13:31.471+00	2025-01-16 15:13:31.471+00
252	15	Pikine	3500.00	2025-01-16 15:13:31.475+00	2025-01-16 15:13:31.475+00
124	8	Point E	1500.00	2025-01-16 15:13:29.553+00	2025-01-16 15:13:29.553+00
144	9	Yoff	2500.00	2025-01-16 15:13:29.862+00	2025-01-16 15:13:29.862+00
162	10	Sacré Coeur	2000.00	2025-01-16 15:13:30.185+00	2025-01-16 15:13:30.185+00
180	11	Yoff	2500.00	2025-01-16 15:13:30.555+00	2025-01-16 15:13:30.555+00
195	12	Yoff	2500.00	2025-01-16 15:13:30.818+00	2025-01-16 15:13:30.818+00
204	12	Rufisque	4500.00	2025-01-16 15:13:30.822+00	2025-01-16 15:13:30.822+00
207	13	Amitité I	1500.00	2025-01-16 15:13:31.028+00	2025-01-16 15:13:31.028+00
217	13	HLM	2000.00	2025-01-16 15:13:31.039+00	2025-01-16 15:13:31.039+00
230	14	Plateau	1500.00	2025-01-16 15:13:31.259+00	2025-01-16 15:13:31.259+00
247	15	Ngor	3000.00	2025-01-16 15:13:31.473+00	2025-01-16 15:13:31.473+00
255	15	Grand Dakar	2000.00	2025-01-16 15:13:31.475+00	2025-01-16 15:13:31.475+00
125	8	Ngor	3000.00	2025-01-16 15:13:29.555+00	2025-01-16 15:13:29.555+00
134	8	HLM	2000.00	2025-01-16 15:13:29.557+00	2025-01-16 15:13:29.557+00
143	9	Almadies	2000.00	2025-01-16 15:13:29.855+00	2025-01-16 15:13:29.855+00
150	9	Grand Dakar	2000.00	2025-01-16 15:13:29.868+00	2025-01-16 15:13:29.868+00
159	10	Plateau	1500.00	2025-01-16 15:13:30.182+00	2025-01-16 15:13:30.182+00
169	10	Rufisque	4500.00	2025-01-16 15:13:30.19+00	2025-01-16 15:13:30.19+00
175	11	Fass	1000.00	2025-01-16 15:13:30.529+00	2025-01-16 15:13:30.529+00
185	11	Guediawaye	4000.00	2025-01-16 15:13:30.573+00	2025-01-16 15:13:30.573+00
191	12	Fass	1000.00	2025-01-16 15:13:30.81+00	2025-01-16 15:13:30.811+00
201	12	Grand Dakar	2000.00	2025-01-16 15:13:30.821+00	2025-01-16 15:13:30.821+00
213	13	Point E	1500.00	2025-01-16 15:13:31.031+00	2025-01-16 15:13:31.031+00
228	14	Yoff	2500.00	2025-01-16 15:13:31.26+00	2025-01-16 15:13:31.26+00
245	15	Sacré Coeur	2000.00	2025-01-16 15:13:31.474+00	2025-01-16 15:13:31.474+00
126	8	Yoff	2500.00	2025-01-16 15:13:29.555+00	2025-01-16 15:13:29.555+00
133	8	Grand Dakar	2000.00	2025-01-16 15:13:29.558+00	2025-01-16 15:13:29.558+00
145	9	Point E	1500.00	2025-01-16 15:13:29.857+00	2025-01-16 15:13:29.857+00
160	10	Ngor	3000.00	2025-01-16 15:13:30.184+00	2025-01-16 15:13:30.184+00
179	11	Sacré Coeur	2000.00	2025-01-16 15:13:30.557+00	2025-01-16 15:13:30.557+00
197	12	Ngor	3000.00	2025-01-16 15:13:30.817+00	2025-01-16 15:13:30.818+00
214	13	Ngor	3000.00	2025-01-16 15:13:31.036+00	2025-01-16 15:13:31.036+00
229	14	Ngor	3000.00	2025-01-16 15:13:31.26+00	2025-01-16 15:13:31.26+00
238	14	Rufisque	4500.00	2025-01-16 15:13:31.265+00	2025-01-16 15:13:31.265+00
246	15	Amitité I	1500.00	2025-01-16 15:13:31.47+00	2025-01-16 15:13:31.47+00
127	8	Ouakam	2500.00	2025-01-16 15:13:29.555+00	2025-01-16 15:13:29.555+00
146	9	Sacré Coeur	2000.00	2025-01-16 15:13:29.864+00	2025-01-16 15:13:29.864+00
147	9	Medina	1500.00	2025-01-16 15:13:29.864+00	2025-01-16 15:13:29.865+00
161	10	Ouakam	2500.00	2025-01-16 15:13:30.183+00	2025-01-16 15:13:30.183+00
170	10	Pikine	3500.00	2025-01-16 15:13:30.188+00	2025-01-16 15:13:30.188+00
176	11	Almadies	2000.00	2025-01-16 15:13:30.538+00	2025-01-16 15:13:30.54+00
186	11	HLM	2000.00	2025-01-16 15:13:30.571+00	2025-01-16 15:13:30.571+00
196	12	Point E	1500.00	2025-01-16 15:13:30.812+00	2025-01-16 15:13:30.812+00
212	13	Sacré Coeur	2000.00	2025-01-16 15:13:31.037+00	2025-01-16 15:13:31.037+00
231	14	Sacré Coeur	2000.00	2025-01-16 15:13:31.26+00	2025-01-16 15:13:31.26+00
248	15	Yoff	2500.00	2025-01-16 15:13:31.473+00	2025-01-16 15:13:31.473+00
254	15	Guediawaye	4000.00	2025-01-16 15:13:31.476+00	2025-01-16 15:13:31.476+00
128	8	Almadies	2000.00	2025-01-16 15:13:29.553+00	2025-01-16 15:13:29.553+00
142	9	Ngor	3000.00	2025-01-16 15:13:29.861+00	2025-01-16 15:13:29.861+00
148	9	HLM	2000.00	2025-01-16 15:13:29.867+00	2025-01-16 15:13:29.867+00
156	10	Mermoz	2000.00	2025-01-16 15:13:30.183+00	2025-01-16 15:13:30.183+00
167	10	Guediawaye	4000.00	2025-01-16 15:13:30.189+00	2025-01-16 15:13:30.189+00
173	11	Amitité I	1500.00	2025-01-16 15:13:30.512+00	2025-01-16 15:13:30.512+00
184	11	Pikine	3500.00	2025-01-16 15:13:30.572+00	2025-01-16 15:13:30.572+00
189	12	Almadies	2000.00	2025-01-16 15:13:30.811+00	2025-01-16 15:13:30.811+00
199	12	Fann	1500.00	2025-01-16 15:13:30.819+00	2025-01-16 15:13:30.82+00
211	13	Plateau	1500.00	2025-01-16 15:13:31.033+00	2025-01-16 15:13:31.033+00
220	13	Rufisque	4500.00	2025-01-16 15:13:31.042+00	2025-01-16 15:13:31.042+00
226	14	Fass	1000.00	2025-01-16 15:13:31.257+00	2025-01-16 15:13:31.257+00
236	14	Guediawaye	4000.00	2025-01-16 15:13:31.264+00	2025-01-16 15:13:31.264+00
244	15	Fass	1000.00	2025-01-16 15:13:31.47+00	2025-01-16 15:13:31.47+00
253	15	Rufisque	4500.00	2025-01-16 15:13:31.476+00	2025-01-16 15:13:31.476+00
3	1	Almadies	2000.00	2025-01-16 15:13:27.236+00	2025-03-03 12:45:05.908+00
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.inventory (id, product_id, tenant_id, quantity, reorder_point, reorder_quantity, low_stock_threshold, created_at, updated_at, reserved_quantity) FROM stdin;
51	51	3	41	7	23	7	2025-01-16 15:15:31.004+00	2025-01-16 15:15:31.004+00	0
52	52	3	71	5	30	8	2025-01-16 15:15:31.258+00	2025-01-16 15:15:31.258+00	0
53	53	3	44	12	16	8	2025-01-16 15:15:31.505+00	2025-01-16 15:15:31.505+00	0
56	56	3	78	9	17	4	2025-01-16 15:15:36.653+00	2025-01-16 15:15:36.654+00	0
57	57	3	41	13	13	8	2025-01-16 15:15:36.906+00	2025-01-16 15:15:36.906+00	0
58	58	3	86	15	17	7	2025-01-16 15:15:37.158+00	2025-01-16 15:15:37.158+00	0
59	59	3	27	13	10	4	2025-01-16 15:15:37.414+00	2025-01-16 15:15:37.414+00	0
60	60	3	87	8	12	5	2025-01-16 15:15:37.679+00	2025-01-16 15:15:37.679+00	0
61	61	3	4	10	15	8	2025-01-16 15:15:37.943+00	2025-01-16 15:15:37.943+00	0
62	62	3	5	13	25	3	2025-01-16 15:15:38.182+00	2025-01-16 15:15:38.182+00	0
63	63	3	23	5	29	8	2025-01-16 15:15:38.46+00	2025-01-16 15:15:38.46+00	0
64	64	3	3	5	26	8	2025-01-16 15:15:38.724+00	2025-01-16 15:15:38.724+00	0
65	65	3	4	13	19	3	2025-01-16 15:15:38.967+00	2025-01-16 15:15:38.967+00	0
66	66	3	95	15	10	6	2025-01-16 15:15:39.226+00	2025-01-16 15:15:39.226+00	0
67	67	3	26	8	14	4	2025-01-16 15:15:39.481+00	2025-01-16 15:15:39.481+00	0
68	68	3	34	10	20	3	2025-01-16 15:15:44.444+00	2025-01-16 15:15:44.445+00	0
69	69	3	23	14	30	6	2025-01-16 15:15:44.711+00	2025-01-16 15:15:44.711+00	0
70	70	3	10	11	29	6	2025-01-16 15:15:44.957+00	2025-01-16 15:15:44.957+00	0
71	71	3	70	10	21	7	2025-01-16 15:15:45.199+00	2025-01-16 15:15:45.199+00	0
72	72	3	42	8	24	5	2025-01-16 15:15:45.438+00	2025-01-16 15:15:45.438+00	0
73	73	3	13	10	12	6	2025-01-16 15:15:45.692+00	2025-01-16 15:15:45.692+00	0
74	74	3	54	13	18	7	2025-01-16 15:15:45.941+00	2025-01-16 15:15:45.941+00	0
75	75	3	32	11	18	5	2025-01-16 15:15:46.304+00	2025-01-16 15:15:46.304+00	0
76	76	3	48	8	16	4	2025-01-16 15:15:46.569+00	2025-01-16 15:15:46.569+00	0
77	77	3	32	13	29	5	2025-01-16 15:15:46.809+00	2025-01-16 15:15:46.809+00	0
78	78	3	67	7	28	8	2025-01-16 15:15:47.051+00	2025-01-16 15:15:47.051+00	0
79	79	3	0	5	21	5	2025-01-16 15:15:47.303+00	2025-01-16 15:15:47.303+00	0
80	80	3	54	15	28	6	2025-01-16 15:15:47.562+00	2025-01-16 15:15:47.562+00	0
81	90	2	54	13	16	4	2025-01-16 15:50:50.003+00	2025-01-16 15:50:50.003+00	0
82	91	2	24	10	22	8	2025-01-16 15:50:50.262+00	2025-01-16 15:50:50.262+00	0
83	92	2	35	7	27	4	2025-01-16 15:50:50.522+00	2025-01-16 15:50:50.522+00	0
84	93	2	58	14	18	5	2025-01-16 15:50:50.771+00	2025-01-16 15:50:50.771+00	0
85	94	2	71	9	26	6	2025-01-16 15:50:51.037+00	2025-01-16 15:50:51.037+00	0
86	95	2	31	7	22	7	2025-01-16 15:50:51.305+00	2025-01-16 15:50:51.305+00	0
87	96	2	98	12	23	4	2025-01-16 15:50:51.552+00	2025-01-16 15:50:51.553+00	0
88	97	2	37	11	12	7	2025-01-16 15:50:51.809+00	2025-01-16 15:50:51.81+00	0
89	98	2	6	7	23	8	2025-01-16 15:50:52.051+00	2025-01-16 15:50:52.051+00	0
90	99	2	64	8	26	6	2025-01-16 15:50:52.298+00	2025-01-16 15:50:52.298+00	0
91	100	2	47	5	18	7	2025-01-16 15:50:52.553+00	2025-01-16 15:50:52.553+00	0
92	101	2	6	9	18	8	2025-01-16 15:50:59.4+00	2025-01-16 15:50:59.401+00	0
93	102	2	0	5	10	4	2025-01-16 15:50:59.69+00	2025-01-16 15:50:59.69+00	0
94	103	2	40	12	17	3	2025-01-16 15:51:00.096+00	2025-01-16 15:51:00.096+00	0
95	104	2	51	5	23	6	2025-01-16 15:51:00.424+00	2025-01-16 15:51:00.424+00	0
96	105	2	66	5	13	4	2025-01-16 15:51:00.84+00	2025-01-16 15:51:00.84+00	0
97	106	2	56	9	13	8	2025-01-16 15:51:01.182+00	2025-01-16 15:51:01.182+00	0
98	107	2	66	6	19	4	2025-01-16 15:51:01.444+00	2025-01-16 15:51:01.445+00	0
99	108	2	45	12	23	5	2025-01-16 15:51:01.691+00	2025-01-16 15:51:01.691+00	0
100	109	2	39	5	21	8	2025-01-16 15:51:01.946+00	2025-01-16 15:51:01.947+00	0
101	110	2	13	6	15	6	2025-01-16 15:51:02.184+00	2025-01-16 15:51:02.184+00	0
102	111	2	72	5	28	5	2025-01-16 15:51:02.429+00	2025-01-16 15:51:02.429+00	0
103	112	2	58	10	23	7	2025-01-16 15:51:02.679+00	2025-01-16 15:51:02.68+00	0
104	113	2	54	5	15	4	2025-01-16 15:51:02.932+00	2025-01-16 15:51:02.932+00	0
105	114	2	76	10	18	8	2025-01-16 15:51:03.178+00	2025-01-16 15:51:03.179+00	0
106	115	2	70	8	30	7	2025-01-16 15:51:03.427+00	2025-01-16 15:51:03.427+00	0
107	116	2	54	12	20	8	2025-01-16 15:51:08.603+00	2025-01-16 15:51:08.603+00	0
55	55	3	16	8	25	3	2025-01-16 15:15:31.988+00	2025-02-06 13:13:44.769+00	0
54	54	3	48	12	18	4	2025-01-16 15:15:31.75+00	2025-02-06 13:13:45.095+00	0
108	117	2	63	7	29	4	2025-01-16 15:51:08.868+00	2025-01-16 15:51:08.868+00	0
109	118	2	3	9	23	5	2025-01-16 15:51:09.135+00	2025-01-16 15:51:09.135+00	0
110	119	2	87	12	22	7	2025-01-16 15:51:09.391+00	2025-01-16 15:51:09.391+00	0
111	120	2	52	15	12	7	2025-01-16 15:51:09.647+00	2025-01-16 15:51:09.648+00	0
112	121	2	3	7	13	5	2025-01-16 15:51:09.912+00	2025-01-16 15:51:09.912+00	0
113	122	2	61	8	10	8	2025-01-16 15:51:10.159+00	2025-01-16 15:51:10.159+00	0
114	123	2	67	8	28	5	2025-01-16 15:51:10.406+00	2025-01-16 15:51:10.406+00	0
115	124	2	65	13	19	8	2025-01-16 15:51:10.652+00	2025-01-16 15:51:10.652+00	0
116	125	2	82	13	22	7	2025-01-16 15:51:10.898+00	2025-01-16 15:51:10.899+00	0
117	126	2	45	10	24	3	2025-01-16 15:51:11.166+00	2025-01-16 15:51:11.166+00	0
118	127	2	55	10	10	6	2025-01-16 15:51:11.419+00	2025-01-16 15:51:11.419+00	0
119	128	2	78	12	29	6	2025-01-16 15:51:11.666+00	2025-01-16 15:51:11.666+00	0
120	129	2	29	7	26	4	2025-01-16 15:51:11.911+00	2025-01-16 15:51:11.911+00	0
121	130	2	78	7	18	6	2025-01-16 15:51:17.613+00	2025-01-16 15:51:17.613+00	0
122	131	2	97	9	28	4	2025-01-16 15:51:17.857+00	2025-01-16 15:51:17.857+00	0
123	132	2	100	14	18	7	2025-01-16 15:51:18.104+00	2025-01-16 15:51:18.104+00	0
124	133	2	100	12	27	8	2025-01-16 15:51:18.359+00	2025-01-16 15:51:18.359+00	0
125	134	2	77	15	26	5	2025-01-16 15:51:18.603+00	2025-01-16 15:51:18.603+00	0
126	135	2	78	9	10	6	2025-01-16 15:51:18.875+00	2025-01-16 15:51:18.875+00	0
127	136	2	31	5	25	3	2025-01-16 15:51:19.117+00	2025-01-16 15:51:19.117+00	0
128	137	2	7	11	22	3	2025-01-16 15:51:19.394+00	2025-01-16 15:51:19.394+00	0
129	138	2	80	6	23	5	2025-01-16 15:51:19.63+00	2025-01-16 15:51:19.63+00	0
130	139	2	32	10	24	6	2025-01-16 15:51:19.881+00	2025-01-16 15:51:19.881+00	0
131	140	2	86	7	16	3	2025-01-16 15:51:20.123+00	2025-01-16 15:51:20.123+00	0
132	141	2	99	6	29	5	2025-01-16 15:51:20.372+00	2025-01-16 15:51:20.372+00	0
133	142	2	11	6	11	6	2025-01-16 15:51:20.634+00	2025-01-16 15:51:20.634+00	0
134	143	2	10	15	13	6	2025-01-16 15:51:20.872+00	2025-01-16 15:51:20.872+00	0
135	144	2	42	13	27	5	2025-01-16 15:51:21.118+00	2025-01-16 15:51:21.118+00	0
136	145	3	18	5	10	3	2025-01-16 15:51:26.212+00	2025-01-16 15:51:26.212+00	0
137	146	3	93	12	27	5	2025-01-16 15:51:26.466+00	2025-01-16 15:51:26.466+00	0
138	147	3	92	5	11	8	2025-01-16 15:51:26.733+00	2025-01-16 15:51:26.733+00	0
139	148	3	84	11	30	6	2025-01-16 15:51:26.986+00	2025-01-16 15:51:26.986+00	0
140	149	3	17	14	20	3	2025-01-16 15:51:27.222+00	2025-01-16 15:51:27.222+00	0
141	150	3	29	11	10	6	2025-01-16 15:51:27.467+00	2025-01-16 15:51:27.468+00	0
142	151	3	18	5	24	7	2025-01-16 15:51:27.737+00	2025-01-16 15:51:27.737+00	0
143	152	3	89	15	18	5	2025-01-16 15:51:27.998+00	2025-01-16 15:51:27.999+00	0
144	153	3	28	5	28	8	2025-01-16 15:51:28.236+00	2025-01-16 15:51:28.236+00	0
145	154	3	42	12	20	8	2025-01-16 15:51:28.482+00	2025-01-16 15:51:28.483+00	0
146	155	3	92	11	18	3	2025-01-16 15:51:28.74+00	2025-01-16 15:51:28.74+00	0
147	156	3	86	11	19	8	2025-01-16 15:51:29.003+00	2025-01-16 15:51:29.004+00	0
148	157	3	64	11	19	5	2025-01-16 15:51:33.197+00	2025-01-16 15:51:33.197+00	0
149	158	3	26	13	23	4	2025-01-16 15:51:33.437+00	2025-01-16 15:51:33.437+00	0
150	159	3	61	12	20	3	2025-01-16 15:51:33.69+00	2025-01-16 15:51:33.69+00	0
151	160	3	60	13	12	4	2025-01-16 15:51:33.949+00	2025-01-16 15:51:33.95+00	0
152	161	3	6	6	10	5	2025-01-16 15:51:34.192+00	2025-01-16 15:51:34.193+00	0
153	162	3	46	8	23	5	2025-01-16 15:51:34.433+00	2025-01-16 15:51:34.434+00	0
154	163	3	22	7	21	8	2025-01-16 15:51:34.691+00	2025-01-16 15:51:34.691+00	0
155	164	3	32	7	21	6	2025-01-16 15:51:34.936+00	2025-01-16 15:51:34.936+00	0
156	165	3	66	7	16	6	2025-01-16 15:51:35.176+00	2025-01-16 15:51:35.176+00	0
157	166	3	4	6	27	4	2025-01-16 15:51:35.42+00	2025-01-16 15:51:35.42+00	0
158	167	3	28	14	29	3	2025-01-16 15:51:35.67+00	2025-01-16 15:51:35.67+00	0
159	168	3	92	9	23	6	2025-01-16 15:51:39.143+00	2025-01-16 15:51:39.143+00	0
160	169	3	2	13	11	6	2025-01-16 15:51:39.381+00	2025-01-16 15:51:39.381+00	0
161	170	3	5	5	16	6	2025-01-16 15:51:39.617+00	2025-01-16 15:51:39.617+00	0
162	171	3	93	11	29	6	2025-01-16 15:51:39.863+00	2025-01-16 15:51:39.863+00	0
163	172	3	30	7	11	6	2025-01-16 15:51:40.11+00	2025-01-16 15:51:40.11+00	0
164	173	3	89	6	29	4	2025-01-16 15:51:40.356+00	2025-01-16 15:51:40.356+00	0
165	174	3	41	12	30	7	2025-01-16 15:51:40.602+00	2025-01-16 15:51:40.603+00	0
166	175	3	89	8	15	5	2025-01-16 15:51:40.868+00	2025-01-16 15:51:40.868+00	0
167	176	3	50	11	25	5	2025-01-16 15:51:41.113+00	2025-01-16 15:51:41.113+00	0
168	177	3	55	10	14	6	2025-01-16 15:51:43.26+00	2025-01-16 15:51:43.26+00	0
169	178	3	62	14	23	5	2025-01-16 15:51:43.497+00	2025-01-16 15:51:43.497+00	0
170	179	3	51	5	24	5	2025-01-16 15:51:43.734+00	2025-01-16 15:51:43.734+00	0
171	180	3	49	12	27	8	2025-01-16 15:51:43.994+00	2025-01-16 15:51:43.994+00	0
172	181	3	99	12	24	3	2025-01-16 15:51:44.237+00	2025-01-16 15:51:44.237+00	0
173	182	4	50	7	13	3	2025-01-16 15:51:48.776+00	2025-01-16 15:51:48.776+00	0
174	183	4	67	10	20	3	2025-01-16 15:51:49.01+00	2025-01-16 15:51:49.01+00	0
175	184	4	71	14	15	7	2025-01-16 15:51:49.247+00	2025-01-16 15:51:49.247+00	0
176	185	4	5	15	15	7	2025-01-16 15:51:49.507+00	2025-01-16 15:51:49.507+00	0
177	186	4	75	10	29	7	2025-01-16 15:51:49.757+00	2025-01-16 15:51:49.757+00	0
178	187	4	86	5	17	4	2025-01-16 15:51:50.026+00	2025-01-16 15:51:50.026+00	0
179	188	4	2	10	24	5	2025-01-16 15:51:50.29+00	2025-01-16 15:51:50.29+00	0
180	189	4	98	6	12	8	2025-01-16 15:51:50.526+00	2025-01-16 15:51:50.527+00	0
181	190	4	77	14	29	5	2025-01-16 15:51:50.775+00	2025-01-16 15:51:50.775+00	0
182	191	4	83	10	24	7	2025-01-16 15:51:51.028+00	2025-01-16 15:51:51.028+00	0
183	192	4	20	12	11	8	2025-01-16 15:51:53.176+00	2025-01-16 15:51:53.176+00	0
184	193	4	96	15	24	8	2025-01-16 15:51:53.412+00	2025-01-16 15:51:53.412+00	0
185	194	4	44	10	20	8	2025-01-16 15:51:53.659+00	2025-01-16 15:51:53.659+00	0
186	195	4	76	8	26	5	2025-01-16 15:51:53.894+00	2025-01-16 15:51:53.894+00	0
187	196	4	66	7	12	7	2025-01-16 15:51:54.13+00	2025-01-16 15:51:54.13+00	0
188	197	4	11	6	26	6	2025-01-16 15:51:59.033+00	2025-01-16 15:51:59.033+00	0
189	198	4	88	8	18	5	2025-01-16 15:51:59.27+00	2025-01-16 15:51:59.27+00	0
190	199	4	24	7	20	4	2025-01-16 15:51:59.506+00	2025-01-16 15:51:59.506+00	0
191	200	4	47	9	15	4	2025-01-16 15:51:59.745+00	2025-01-16 15:51:59.745+00	0
192	201	4	49	7	12	3	2025-01-16 15:52:00+00	2025-01-16 15:52:00+00	0
193	202	4	28	5	25	7	2025-01-16 15:52:00.246+00	2025-01-16 15:52:00.246+00	0
194	203	4	31	10	26	7	2025-01-16 15:52:00.506+00	2025-01-16 15:52:00.507+00	0
195	204	4	97	10	18	5	2025-01-16 15:52:00.759+00	2025-01-16 15:52:00.759+00	0
196	205	4	92	9	22	3	2025-01-16 15:52:01.049+00	2025-01-16 15:52:01.049+00	0
197	206	4	14	5	15	8	2025-01-16 15:52:01.323+00	2025-01-16 15:52:01.323+00	0
198	207	4	96	12	20	5	2025-01-16 15:52:01.565+00	2025-01-16 15:52:01.565+00	0
199	208	4	3	10	23	6	2025-01-16 15:52:01.811+00	2025-01-16 15:52:01.811+00	0
200	209	4	86	8	12	7	2025-01-16 15:52:02.068+00	2025-01-16 15:52:02.068+00	0
201	210	4	66	9	27	8	2025-01-16 15:52:04.489+00	2025-01-16 15:52:04.489+00	0
202	211	4	23	5	24	5	2025-01-16 15:52:04.727+00	2025-01-16 15:52:04.728+00	0
203	212	4	5	5	28	4	2025-01-16 15:52:04.971+00	2025-01-16 15:52:04.971+00	0
204	213	4	100	13	19	8	2025-01-16 15:52:05.21+00	2025-01-16 15:52:05.21+00	0
205	214	4	92	7	29	8	2025-01-16 15:52:05.477+00	2025-01-16 15:52:05.477+00	0
206	215	4	39	14	28	5	2025-01-16 15:52:05.734+00	2025-01-16 15:52:05.735+00	0
207	216	5	86	11	16	7	2025-01-16 15:52:09.297+00	2025-01-16 15:52:09.298+00	0
208	217	5	20	5	24	4	2025-01-16 15:52:09.54+00	2025-01-16 15:52:09.54+00	0
209	218	5	37	8	20	3	2025-01-16 15:52:09.798+00	2025-01-16 15:52:09.798+00	0
210	219	5	77	13	14	7	2025-01-16 15:52:10.061+00	2025-01-16 15:52:10.061+00	0
211	220	5	94	8	16	3	2025-01-16 15:52:10.299+00	2025-01-16 15:52:10.299+00	0
212	221	5	52	14	15	8	2025-01-16 15:52:10.555+00	2025-01-16 15:52:10.555+00	0
213	222	5	29	14	14	7	2025-01-16 15:52:10.811+00	2025-01-16 15:52:10.812+00	0
214	223	5	65	8	26	7	2025-01-16 15:52:12.892+00	2025-01-16 15:52:12.892+00	0
215	224	5	59	13	27	8	2025-01-16 15:52:13.133+00	2025-01-16 15:52:13.133+00	0
216	225	5	47	8	14	7	2025-01-16 15:52:13.37+00	2025-01-16 15:52:13.37+00	0
217	226	5	54	12	10	3	2025-01-16 15:52:13.606+00	2025-01-16 15:52:13.606+00	0
218	227	5	64	5	15	5	2025-01-16 15:52:13.843+00	2025-01-16 15:52:13.843+00	0
220	229	5	0	12	11	7	2025-01-16 15:52:18.628+00	2025-01-16 15:52:18.628+00	0
221	230	5	48	10	20	5	2025-01-16 15:52:18.88+00	2025-01-16 15:52:18.88+00	0
222	231	5	6	7	14	8	2025-01-16 15:52:19.13+00	2025-01-16 15:52:19.13+00	0
223	232	5	53	10	18	3	2025-01-16 15:52:19.381+00	2025-01-16 15:52:19.381+00	0
224	233	5	51	6	12	4	2025-01-16 15:52:19.622+00	2025-01-16 15:52:19.622+00	0
225	234	5	4	5	29	4	2025-01-16 15:52:19.874+00	2025-01-16 15:52:19.875+00	0
226	235	5	47	10	17	4	2025-01-16 15:52:20.114+00	2025-01-16 15:52:20.114+00	0
227	236	5	29	11	14	7	2025-01-16 15:52:20.352+00	2025-01-16 15:52:20.352+00	0
228	237	5	45	5	22	4	2025-01-16 15:52:20.611+00	2025-01-16 15:52:20.611+00	0
229	238	5	73	10	28	8	2025-01-16 15:52:20.853+00	2025-01-16 15:52:20.853+00	0
230	239	5	16	5	14	5	2025-01-16 15:52:21.1+00	2025-01-16 15:52:21.1+00	0
231	240	5	96	11	29	5	2025-01-16 15:52:24.225+00	2025-01-16 15:52:24.225+00	0
232	241	5	54	11	21	3	2025-01-16 15:52:24.466+00	2025-01-16 15:52:24.466+00	0
233	242	5	39	6	25	8	2025-01-16 15:52:24.72+00	2025-01-16 15:52:24.72+00	0
234	243	5	78	15	24	7	2025-01-16 15:52:24.959+00	2025-01-16 15:52:24.959+00	0
235	244	5	50	11	22	5	2025-01-16 15:52:25.214+00	2025-01-16 15:52:25.214+00	0
236	245	5	7	7	17	7	2025-01-16 15:52:25.459+00	2025-01-16 15:52:25.459+00	0
237	246	5	49	8	14	6	2025-01-16 15:52:25.7+00	2025-01-16 15:52:25.701+00	0
238	247	5	32	6	12	7	2025-01-16 15:52:25.954+00	2025-01-16 15:52:25.954+00	0
219	228	5	2	5	14	8	2025-01-16 15:52:18.382+00	2025-02-06 13:58:25.574+00	2
\.


--
-- Data for Name: menu_item_permissions; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.menu_item_permissions (id, menu_item_id, permission_id, created_at, updated_at) FROM stdin;
1	1	25	2025-01-16 15:11:11.341488+00	2025-01-16 15:11:11.341488+00
2	2	14	2025-01-16 15:11:11.52865+00	2025-01-16 15:11:11.52865+00
3	2	13	2025-01-16 15:11:11.52865+00	2025-01-16 15:11:11.52865+00
4	3	14	2025-01-16 15:11:11.705591+00	2025-01-16 15:11:11.705591+00
5	4	13	2025-01-16 15:11:11.882483+00	2025-01-16 15:11:11.882483+00
6	5	2	2025-01-16 15:11:12.069828+00	2025-01-16 15:11:12.069828+00
7	5	1	2025-01-16 15:11:12.069828+00	2025-01-16 15:11:12.069828+00
8	6	2	2025-01-16 15:11:12.237781+00	2025-01-16 15:11:12.237781+00
9	7	1	2025-01-16 15:11:12.404396+00	2025-01-16 15:11:12.404396+00
10	8	18	2025-01-16 15:11:12.5817+00	2025-01-16 15:11:12.5817+00
11	8	17	2025-01-16 15:11:12.5817+00	2025-01-16 15:11:12.5817+00
14	11	26	2025-01-16 15:11:13.113235+00	2025-01-16 15:11:13.113235+00
15	11	27	2025-01-16 15:11:13.113235+00	2025-01-16 15:11:13.113235+00
16	12	27	2025-01-16 15:11:13.270978+00	2025-01-16 15:11:13.270978+00
18	14	10	2025-02-07 15:43:36.047914+00	2025-02-07 15:43:36.047914+00
19	17	2	2025-02-27 14:49:11.096514+00	2025-02-27 14:49:11.096514+00
20	18	10	2025-02-27 14:53:21.799386+00	2025-02-27 14:53:21.799386+00
21	19	34	2025-02-28 15:10:26.601491+00	2025-02-28 15:10:26.601491+00
\.


--
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.menu_items (id, label, route, icon, parent_id, tenant_id, "order", is_active, is_internal, created_at, updated_at) FROM stdin;
1	Dashboard	/dashboard	dashboard	\N	\N	0	t	t	2025-01-16 15:11:10.166+00	2025-01-16 15:11:10.169+00
2	User management	/dashboard/users	people	\N	\N	1	t	t	2025-01-16 15:11:11.649+00	2025-01-16 15:11:11.65+00
3	View Users	/dashboard/users	list	2	\N	2	t	t	2025-01-16 15:11:11.834+00	2025-01-16 15:11:11.834+00
4	Create User	/dashboard/users/create	person_add	2	\N	3	t	t	2025-01-16 15:11:12.008+00	2025-01-16 15:11:12.008+00
5	Tenant management	/dashboard/tenants	business	\N	\N	4	t	t	2025-01-16 15:11:12.187+00	2025-01-16 15:11:12.189+00
6	View Tenants	/dashboard/tenants	list	5	\N	5	t	t	2025-01-16 15:11:12.371+00	2025-01-16 15:11:12.372+00
7	Create Tenant	/dashboard/tenants/create	add_business	5	\N	6	t	t	2025-01-16 15:11:12.539+00	2025-01-16 15:11:12.539+00
11	Products	/dashboard/products	inventory_2	\N	\N	9	t	t	2025-01-16 15:11:13.256+00	2025-01-16 15:11:13.256+00
12	View Products	/dashboard/products	list	11	\N	10	t	t	2025-01-16 15:11:13.415+00	2025-01-16 15:11:13.415+00
14	Orders	/dashboard/orders	shopping_cart	\N	\N	11	t	t	2025-02-07 15:40:41.327844+00	2025-02-07 15:40:41.327844+00
17	Menu	/dashboard/menus	list	\N	1	12	t	t	2025-02-27 14:49:11.892+00	2025-02-27 14:49:11.892+00
18	Deliveries	/dashboard/deliveries	local_shipping 	\N	1	13	t	t	2025-02-27 14:53:22.608+00	2025-02-27 14:53:22.609+00
19	Delivery Zones	/dashboard/zones	place	\N	1	14	t	t	2025-02-28 15:10:26.53+00	2025-02-28 15:10:26.53+00
8	Roles & Permissions	/dashboard/rbac	security	\N	\N	7	t	t	2025-01-16 15:11:12.706+00	2025-01-16 15:11:12.706+00
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.notifications (id, type, title, message, data, user_id, tenant_id, created_at, updated_at, is_read) FROM stdin;
2	order_status	Order Status Update	Order #5 has been processing	{"orderId":5,"status":"processing","total":"2674.43"}	\N	1	2025-01-24 12:01:28.517+00	\N	f
4	order_status	Order Status Update	Order #5 has been shipped	{"orderId":5,"status":"shipped","total":"2674.43"}	\N	1	2025-01-24 12:27:10.036+00	\N	f
6	order_status	Order Status Update	Order #4 has been processing	{"orderId":4,"status":"processing","total":"1946.45"}	\N	1	2025-01-24 13:24:35.605+00	\N	f
7	new_order	New Order Received	New order #12 received from undefined	{"orderId":12,"total":2481.01}	\N	1	2025-01-24 13:31:48.48+00	\N	f
9	order_status	Order Status Update	Order #4 has been shipped	{"orderId":4,"status":"shipped","total":"1946.45"}	\N	1	2025-01-24 16:34:01.459+00	\N	f
11	order_status	Order Status Update	Order #4 has been delivered	{"orderId":4,"status":"delivered","total":"1946.45"}	\N	1	2025-01-24 16:35:08.535+00	\N	f
12	new_order	New Order Received	New order #16 received from undefined	{"orderId":16,"total":2481.99}	\N	1	2025-01-27 12:07:33.71+00	2025-01-27 12:07:33.711+00	f
13	new_order	New Order Received	New order #17 received from undefined	{"orderId":17,"total":2069.14}	\N	1	2025-01-27 13:44:39.908+00	2025-01-27 13:44:39.908+00	f
15	order:created	New Order Received	New order #18 has been placed for $2069.14	{"orderId":18,"total":2069.14,"items":[{"productId":55,"quantity":1,"unitPrice":"463.85"},{"productId":54,"quantity":1,"unitPrice":"605.29"}]}	\N	1	2025-01-29 12:07:16.75+00	2025-01-29 12:07:16.75+00	f
18	order:status_updated	Order Status Changed	Order #17 status changed from pending to cancelled	{"orderId":17,"status":"cancelled","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	7	1	2025-01-29 12:47:50.573+00	2025-01-29 12:47:50.573+00	f
22	order:created	New Order Received	New order #19 has been placed for $2331.19	{"orderId":19,"total":2331.19,"items":[{"productId":129,"quantity":1,"unitPrice":"572.20"},{"productId":128,"quantity":1,"unitPrice":"758.99"}],"customer":{"id":17}}	7	1	2025-01-29 12:59:07.891+00	2025-01-29 12:59:07.891+00	f
26	order:status_updated	Order Status Changed	Order #19 status changed from pending to processing	{"orderId":19,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	7	1	2025-01-29 13:00:50.159+00	2025-01-29 13:00:50.159+00	f
30	order:status_updated	Order Status Changed	Order #19 status changed from processing to shipped	{"orderId":19,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	7	1	2025-01-29 13:01:05.36+00	2025-01-29 13:01:05.36+00	f
34	order:created	New Order Received	New order #20 has been placed for $2581.23	{"orderId":20,"total":2581.23,"items":[{"productId":200,"quantity":1,"unitPrice":"671.85"},{"productId":202,"quantity":2,"unitPrice":"454.69"}],"customer":{"id":17}}	7	1	2025-01-29 13:07:06.151+00	2025-01-29 13:07:06.151+00	f
1	order_status	Order Status Update	Your order #5 status has been updated to processing	{"orderId":5,"status":"processing"}	16	\N	2025-01-24 12:01:28.374+00	\N	t
16	order:status_updated	Order Status Updated	Order #18 status has been updated to cancelled	{"orderId":18,"status":"cancelled","previousStatus":"pending","total":"2069.14"}	17	1	2025-01-29 12:42:05.126+00	2025-01-29 12:42:05.126+00	t
17	order:status_updated	Order Status Updated	Order #17 status has been updated to cancelled	{"orderId":17,"status":"cancelled","previousStatus":"pending","total":"2069.14"}	17	1	2025-01-29 12:47:50.361+00	2025-01-29 12:47:50.361+00	t
20	order:status_updated	Order Status Changed	Order #17 status changed from pending to cancelled	{"orderId":17,"status":"cancelled","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	17	1	2025-01-29 12:47:50.75+00	2025-01-29 12:47:50.751+00	t
21	order:created	Order Confirmation	Your order #19 has been placed successfully	{"orderId":19,"total":2331.19,"items":[{"productId":129,"quantity":1,"unitPrice":"572.20"},{"productId":128,"quantity":1,"unitPrice":"758.99"}]}	17	1	2025-01-29 12:59:07.717+00	2025-01-29 12:59:07.717+00	t
24	order:created	New Order Received	New order #19 has been placed for $2331.19	{"orderId":19,"total":2331.19,"items":[{"productId":129,"quantity":1,"unitPrice":"572.20"},{"productId":128,"quantity":1,"unitPrice":"758.99"}],"customer":{"id":17}}	17	1	2025-01-29 12:59:08.063+00	2025-01-29 12:59:08.063+00	t
25	order:status_updated	Order Status Updated	Order #19 status has been updated to processing	{"orderId":19,"status":"processing","previousStatus":"pending","total":"2331.19"}	17	1	2025-01-29 13:00:49.989+00	2025-01-29 13:00:49.989+00	t
28	order:status_updated	Order Status Changed	Order #19 status changed from pending to processing	{"orderId":19,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	17	1	2025-01-29 13:00:50.335+00	2025-01-29 13:00:50.335+00	t
29	order:status_updated	Order Status Updated	Order #19 status has been updated to shipped	{"orderId":19,"status":"shipped","previousStatus":"processing","total":"2331.19"}	17	1	2025-01-29 13:01:05.192+00	2025-01-29 13:01:05.192+00	t
38	order:status_updated	Order Status Changed	Order #20 status changed from pending to processing	{"orderId":20,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	7	1	2025-01-29 13:11:05.826+00	2025-01-29 13:11:05.827+00	f
42	order:status_updated	Order Status Changed	Order #20 status changed from processing to shipped	{"orderId":20,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	7	1	2025-01-29 13:12:26.18+00	2025-01-29 13:12:26.18+00	f
46	order:status_updated	Order Status Changed	Order #20 status changed from shipped to delivered	{"orderId":20,"status":"delivered","previousStatus":"shipped","customer":{"id":17,"username":"aristide"}}	7	1	2025-01-29 13:24:16.884+00	2025-01-29 13:24:16.884+00	f
3	order_status	Order Status Update	Your order #5 status has been updated to shipped	{"orderId":5,"status":"shipped"}	16	\N	2025-01-24 12:27:09.902+00	\N	t
5	order_status	Order Status Update	Your order #4 status has been updated to processing	{"orderId":4,"status":"processing"}	16	\N	2025-01-24 13:24:35.38+00	\N	t
8	order_status	Order Status Update	Your order #4 status has been updated to shipped	{"orderId":4,"status":"shipped"}	16	\N	2025-01-24 16:34:01.347+00	\N	t
10	order_status	Order Status Update	Your order #4 status has been updated to delivered	{"orderId":4,"status":"delivered"}	16	\N	2025-01-24 16:35:08.437+00	\N	t
14	order:status_updated	Order Status Updated	Order #16 status has been updated to shipped	{"orderId":16,"status":"shipped","previousStatus":"processing","total":"2481.99"}	16	1	2025-01-29 12:05:09.364+00	2025-01-29 12:05:09.365+00	t
19	order:status_updated	Order Status Changed	Order #17 status changed from pending to cancelled	{"orderId":17,"status":"cancelled","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	16	1	2025-01-29 12:47:50.663+00	2025-01-29 12:47:50.664+00	t
23	order:created	New Order Received	New order #19 has been placed for $2331.19	{"orderId":19,"total":2331.19,"items":[{"productId":129,"quantity":1,"unitPrice":"572.20"},{"productId":128,"quantity":1,"unitPrice":"758.99"}],"customer":{"id":17}}	16	1	2025-01-29 12:59:07.981+00	2025-01-29 12:59:07.981+00	t
27	order:status_updated	Order Status Changed	Order #19 status changed from pending to processing	{"orderId":19,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	16	1	2025-01-29 13:00:50.247+00	2025-01-29 13:00:50.247+00	t
31	order:status_updated	Order Status Changed	Order #19 status changed from processing to shipped	{"orderId":19,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	16	1	2025-01-29 13:01:05.439+00	2025-01-29 13:01:05.44+00	t
36	order:created	New Order Received	New order #20 has been placed for $2581.23	{"orderId":20,"total":2581.23,"items":[{"productId":200,"quantity":1,"unitPrice":"671.85"},{"productId":202,"quantity":2,"unitPrice":"454.69"}],"customer":{"id":17}}	16	1	2025-01-29 13:07:06.323+00	2025-01-29 13:07:06.323+00	t
40	order:status_updated	Order Status Changed	Order #20 status changed from pending to processing	{"orderId":20,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	16	1	2025-01-29 13:11:05.996+00	2025-01-29 13:11:05.996+00	t
44	order:status_updated	Order Status Changed	Order #20 status changed from processing to shipped	{"orderId":20,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	16	1	2025-01-29 13:12:26.36+00	2025-01-29 13:12:26.36+00	t
47	order:status_updated	Order Status Changed	Order #20 status changed from shipped to delivered	{"orderId":20,"status":"delivered","previousStatus":"shipped","customer":{"id":17,"username":"aristide"}}	16	1	2025-01-29 13:24:16.986+00	2025-01-29 13:24:16.987+00	t
32	order:status_updated	Order Status Changed	Order #19 status changed from processing to shipped	{"orderId":19,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	17	1	2025-01-29 13:01:05.518+00	2025-01-29 13:01:05.518+00	t
33	order:created	Order Confirmation	Your order #20 has been placed successfully	{"orderId":20,"total":2581.23,"items":[{"productId":200,"quantity":1,"unitPrice":"671.85"},{"productId":202,"quantity":2,"unitPrice":"454.69"}]}	17	1	2025-01-29 13:07:05.967+00	2025-01-29 13:07:05.967+00	t
35	order:created	New Order Received	New order #20 has been placed for $2581.23	{"orderId":20,"total":2581.23,"items":[{"productId":200,"quantity":1,"unitPrice":"671.85"},{"productId":202,"quantity":2,"unitPrice":"454.69"}],"customer":{"id":17}}	17	1	2025-01-29 13:07:06.233+00	2025-01-29 13:07:06.234+00	t
37	order:status_updated	Order Status Updated	Order #20 status has been updated to processing	{"orderId":20,"status":"processing","previousStatus":"pending","total":"2581.23"}	17	1	2025-01-29 13:11:05.633+00	2025-01-29 13:11:05.633+00	t
39	order:status_updated	Order Status Changed	Order #20 status changed from pending to processing	{"orderId":20,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	17	1	2025-01-29 13:11:05.908+00	2025-01-29 13:11:05.908+00	t
41	order:status_updated	Order Status Updated	Order #20 status has been updated to shipped	{"orderId":20,"status":"shipped","previousStatus":"processing","total":"2581.23"}	17	1	2025-01-29 13:12:25.995+00	2025-01-29 13:12:25.996+00	t
43	order:status_updated	Order Status Changed	Order #20 status changed from processing to shipped	{"orderId":20,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	17	1	2025-01-29 13:12:26.262+00	2025-01-29 13:12:26.262+00	t
45	order:status_updated	Order Status Updated	Order #20 status has been updated to delivered	{"orderId":20,"status":"delivered","previousStatus":"shipped","total":"2581.23"}	17	1	2025-01-29 13:24:16.636+00	2025-01-29 13:24:16.636+00	t
48	order:status_updated	Order Status Changed	Order #20 status changed from shipped to delivered	{"orderId":20,"status":"delivered","previousStatus":"shipped","customer":{"id":17,"username":"aristide"}}	17	1	2025-01-29 13:24:17.156+00	2025-01-29 13:24:17.156+00	t
50	order:status_updated	Order Status Changed	Order #19 status changed from shipped to delivered	{"orderId":19,"status":"delivered","previousStatus":"shipped","customer":{"id":17,"username":"aristide"}}	7	1	2025-01-29 15:22:14.707+00	2025-01-29 15:22:14.708+00	f
49	order:status_updated	Order Status Updated	Order #19 status has been updated to delivered	{"orderId":19,"status":"delivered","previousStatus":"shipped","total":"2331.19"}	17	1	2025-01-29 15:22:14.494+00	2025-01-29 15:22:14.494+00	t
52	order:status_updated	Order Status Changed	Order #19 status changed from shipped to delivered	{"orderId":19,"status":"delivered","previousStatus":"shipped","customer":{"id":17,"username":"aristide"}}	17	1	2025-01-29 15:22:14.887+00	2025-01-29 15:22:14.887+00	t
51	order:status_updated	Order Status Changed	Order #19 status changed from shipped to delivered	{"orderId":19,"status":"delivered","previousStatus":"shipped","customer":{"id":17,"username":"aristide"}}	16	1	2025-01-29 15:22:14.797+00	2025-01-29 15:22:14.797+00	t
54	order:created	New Order Received	New order #21 has been placed for $2903.39	{"orderId":21,"total":2903.39,"items":[{"productId":129,"quantity":2,"unitPrice":"572.20"},{"productId":128,"quantity":1,"unitPrice":"758.99"}],"customer":{"id":17}}	7	1	2025-02-04 12:10:43.583+00	2025-02-04 12:10:43.583+00	f
53	order:created	Order Confirmation	Your order #21 has been placed successfully	{"orderId":21,"total":2903.39,"items":[{"productId":129,"quantity":2,"unitPrice":"572.20"},{"productId":128,"quantity":1,"unitPrice":"758.99"}]}	17	1	2025-02-04 12:10:43.393+00	2025-02-04 12:10:43.393+00	t
55	order:created	New Order Received	New order #21 has been placed for $2903.39	{"orderId":21,"total":2903.39,"items":[{"productId":129,"quantity":2,"unitPrice":"572.20"},{"productId":128,"quantity":1,"unitPrice":"758.99"}],"customer":{"id":17}}	17	1	2025-02-04 12:10:43.674+00	2025-02-04 12:10:43.674+00	t
56	order:created	New Order Received	New order #21 has been placed for $2903.39	{"orderId":21,"total":2903.39,"items":[{"productId":129,"quantity":2,"unitPrice":"572.20"},{"productId":128,"quantity":1,"unitPrice":"758.99"}],"customer":{"id":17}}	16	1	2025-02-04 12:10:43.772+00	2025-02-04 12:10:43.772+00	t
58	user:welcome	Welcome to the Platform	Welcome TOUGUE! Your account has been created successfully.	{"permissions":[]}	18	1	2025-02-04 12:14:50.571+00	2025-02-04 12:14:50.571+00	f
57	user:registered	New User Registration	TOUGUE ATE has registered as user	{"userId":18,"username":"erastera","email":"tougue-aristide.ate@epita.fr","permissions":[]}	16	1	2025-02-04 12:14:50.15+00	2025-02-04 12:14:50.151+00	t
60	order:created	New Order Received	New order #22 has been placed for $2152.18	{"orderId":22,"total":2152.18,"items":[{"productId":228,"quantity":2,"unitPrice":"576.09"}],"customer":{"id":17}}	7	1	2025-02-04 12:20:51.161+00	2025-02-04 12:20:51.161+00	f
59	order:created	Order Confirmation	Your order #22 has been placed successfully	{"orderId":22,"total":2152.18,"items":[{"productId":228,"quantity":2,"unitPrice":"576.09"}]}	17	1	2025-02-04 12:20:50.978+00	2025-02-04 12:20:50.978+00	t
61	order:created	New Order Received	New order #22 has been placed for $2152.18	{"orderId":22,"total":2152.18,"items":[{"productId":228,"quantity":2,"unitPrice":"576.09"}],"customer":{"id":17}}	17	1	2025-02-04 12:20:51.247+00	2025-02-04 12:20:51.247+00	t
65	order:created	New Order Received	New order #24 has been placed for $1463.85	{"orderId":24,"total":1463.85,"items":[{"productId":55,"quantity":1,"unitPrice":"463.85"}],"customer":{"id":17}}	7	1	2025-02-05 11:43:50.833+00	2025-02-05 11:43:50.833+00	f
62	order:created	New Order Received	New order #22 has been placed for $2152.18	{"orderId":22,"total":2152.18,"items":[{"productId":228,"quantity":2,"unitPrice":"576.09"}],"customer":{"id":17}}	16	1	2025-02-04 12:20:51.341+00	2025-02-04 12:20:51.341+00	t
66	order:created	New Order Received	New order #24 has been placed for $1463.85	{"orderId":24,"total":1463.85,"items":[{"productId":55,"quantity":1,"unitPrice":"463.85"}],"customer":{"id":17}}	16	1	2025-02-05 11:43:50.92+00	2025-02-05 11:43:50.92+00	t
63	order:created	Order Confirmation	Your order #23 has been placed successfully	{"orderId":23,"total":1576.09,"items":[{"productId":228,"quantity":1,"unitPrice":"576.09"}]}	17	1	2025-02-05 11:42:33.311+00	2025-02-05 11:42:33.311+00	t
64	order:created	Order Confirmation	Your order #24 has been placed successfully	{"orderId":24,"total":1463.85,"items":[{"productId":55,"quantity":1,"unitPrice":"463.85"}]}	17	1	2025-02-05 11:43:50.662+00	2025-02-05 11:43:50.662+00	t
67	order:created	New Order Received	New order #24 has been placed for $1463.85	{"orderId":24,"total":1463.85,"items":[{"productId":55,"quantity":1,"unitPrice":"463.85"}],"customer":{"id":17}}	17	1	2025-02-05 11:43:51.008+00	2025-02-05 11:43:51.008+00	t
69	order:status_updated	Order Status Changed	Order #24 status changed from pending to processing	{"orderId":24,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	7	1	2025-02-05 12:44:15.423+00	2025-02-05 12:44:15.423+00	f
68	order:status_updated	Order Status Updated	Order #24 status has been updated to processing	{"orderId":24,"status":"processing","previousStatus":"pending","total":"1463.85"}	17	1	2025-02-05 12:44:15.227+00	2025-02-05 12:44:15.227+00	t
71	order:status_updated	Order Status Changed	Order #24 status changed from pending to processing	{"orderId":24,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	17	1	2025-02-05 12:44:15.609+00	2025-02-05 12:44:15.609+00	t
73	order:status_updated	Order Status Changed	Order #24 status changed from processing to shipped	{"orderId":24,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	7	1	2025-02-05 14:05:18.645+00	2025-02-05 14:05:18.646+00	f
70	order:status_updated	Order Status Changed	Order #24 status changed from pending to processing	{"orderId":24,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	16	1	2025-02-05 12:44:15.517+00	2025-02-05 12:44:15.517+00	t
74	order:status_updated	Order Status Changed	Order #24 status changed from processing to shipped	{"orderId":24,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	16	1	2025-02-05 14:05:18.732+00	2025-02-05 14:05:18.732+00	t
72	order:status_updated	Order Status Updated	Order #24 status has been updated to shipped	{"orderId":24,"status":"shipped","previousStatus":"processing","total":"1463.85"}	17	1	2025-02-05 14:05:18.452+00	2025-02-05 14:05:18.452+00	t
75	order:status_updated	Order Status Changed	Order #24 status changed from processing to shipped	{"orderId":24,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	17	1	2025-02-05 14:05:18.818+00	2025-02-05 14:05:18.819+00	t
77	order:created	New Order Received	New order #25 has been placed for 5559.44 FCFA	{"orderId":25,"total":5559.44,"items":[{"productId":55,"quantity":2,"unitPrice":"463.85"},{"productId":54,"quantity":6,"unitPrice":"605.29"}],"customer":{"id":17,"name":"aristide"}}	7	1	2025-02-06 13:03:40.869+00	2025-02-06 13:03:40.87+00	f
78	order:created	New Order Received	New order #25 has been placed for 5559.44 FCFA	{"orderId":25,"total":5559.44,"items":[{"productId":55,"quantity":2,"unitPrice":"463.85"},{"productId":54,"quantity":6,"unitPrice":"605.29"}],"customer":{"id":17,"name":"aristide"}}	16	1	2025-02-06 13:03:40.963+00	2025-02-06 13:03:40.963+00	t
81	order:status_updated	Order Status Changed	Order #25 status changed from pending to processing	{"orderId":25,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	7	1	2025-02-06 13:05:20.371+00	2025-02-06 13:05:20.372+00	f
82	order:status_updated	Order Status Changed	Order #25 status changed from pending to processing	{"orderId":25,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	16	1	2025-02-06 13:05:20.458+00	2025-02-06 13:05:20.458+00	t
76	order:created	Order Confirmation	Your order #25 has been placed successfully	{"orderId":25,"total":5559.44,"items":[{"productId":55,"quantity":2,"unitPrice":"463.85"},{"productId":54,"quantity":6,"unitPrice":"605.29"}]}	17	1	2025-02-06 13:03:40.666+00	2025-02-06 13:03:40.666+00	t
79	order:created	New Order Received	New order #25 has been placed for 5559.44 FCFA	{"orderId":25,"total":5559.44,"items":[{"productId":55,"quantity":2,"unitPrice":"463.85"},{"productId":54,"quantity":6,"unitPrice":"605.29"}],"customer":{"id":17,"name":"aristide"}}	17	1	2025-02-06 13:03:41.057+00	2025-02-06 13:03:41.057+00	t
80	order:status_updated	Order Status Updated	Your order is being prepared	{"orderId":25,"status":"processing","previousStatus":"pending","total":"5559.44"}	17	1	2025-02-06 13:05:20.179+00	2025-02-06 13:05:20.179+00	t
83	order:status_updated	Order Status Changed	Order #25 status changed from pending to processing	{"orderId":25,"status":"processing","previousStatus":"pending","customer":{"id":17,"username":"aristide"}}	17	1	2025-02-06 13:05:20.55+00	2025-02-06 13:05:20.55+00	t
85	order:status_updated	Order Status Changed	Order #25 status changed from processing to shipped	{"orderId":25,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	7	1	2025-02-06 13:13:45.692+00	2025-02-06 13:13:45.692+00	f
89	order:status_updated	Order Status Changed	Order #25 status changed from shipped to delivered	{"orderId":25,"status":"delivered","previousStatus":"shipped","customer":{"id":17,"username":"aristide"}}	7	1	2025-02-06 13:24:09.323+00	2025-02-06 13:24:09.323+00	f
86	order:status_updated	Order Status Changed	Order #25 status changed from processing to shipped	{"orderId":25,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	16	1	2025-02-06 13:13:45.779+00	2025-02-06 13:13:45.779+00	t
90	order:status_updated	Order Status Changed	Order #25 status changed from shipped to delivered	{"orderId":25,"status":"delivered","previousStatus":"shipped","customer":{"id":17,"username":"aristide"}}	16	1	2025-02-06 13:24:09.423+00	2025-02-06 13:24:09.423+00	t
84	order:status_updated	Order Status Updated	Your order has been shipped	{"orderId":25,"status":"shipped","previousStatus":"processing","total":"5559.44"}	17	1	2025-02-06 13:13:45.493+00	2025-02-06 13:13:45.493+00	t
87	order:status_updated	Order Status Changed	Order #25 status changed from processing to shipped	{"orderId":25,"status":"shipped","previousStatus":"processing","customer":{"id":17,"username":"aristide"}}	17	1	2025-02-06 13:13:45.869+00	2025-02-06 13:13:45.869+00	t
88	order:status_updated	Order Status Updated	Your order has been delivered	{"orderId":25,"status":"delivered","previousStatus":"shipped","total":"5559.44"}	17	1	2025-02-06 13:24:09.105+00	2025-02-06 13:24:09.106+00	t
91	order:status_updated	Order Status Changed	Order #25 status changed from shipped to delivered	{"orderId":25,"status":"delivered","previousStatus":"shipped","customer":{"id":17,"username":"aristide"}}	17	1	2025-02-06 13:24:09.518+00	2025-02-06 13:24:09.519+00	t
93	order:created	New Order Received	New order #26 has been placed for 2152.18 FCFA	{"orderId":26,"total":2152.18,"items":[{"productId":228,"quantity":2,"unitPrice":"576.09"}],"customer":{"id":17,"name":"aristide"}}	7	1	2025-02-06 13:58:26.824+00	2025-02-06 13:58:26.824+00	f
95	order:created	New Order Received	New order #26 has been placed for 2152.18 FCFA	{"orderId":26,"total":2152.18,"items":[{"productId":228,"quantity":2,"unitPrice":"576.09"}],"customer":{"id":17,"name":"aristide"}}	17	1	2025-02-06 13:58:26.997+00	2025-02-06 13:58:38.636+00	t
92	order:created	Order Confirmation	Your order #26 has been placed successfully	{"orderId":26,"total":2152.18,"items":[{"productId":228,"quantity":2,"unitPrice":"576.09"}]}	17	1	2025-02-06 13:58:26.624+00	2025-02-06 13:58:46.1+00	t
94	order:created	New Order Received	New order #26 has been placed for 2152.18 FCFA	{"orderId":26,"total":2152.18,"items":[{"productId":228,"quantity":2,"unitPrice":"576.09"}],"customer":{"id":17,"name":"aristide"}}	16	1	2025-02-06 13:58:26.913+00	2025-02-07 11:01:24.144+00	t
96	delivery:assigned	New Delivery Assignment	You have been assigned to deliver order #26	{"orderId":26,"deliveryId":1}	1	1	2025-03-04 11:19:09.784+00	2025-03-04 11:19:09.784+00	f
97	delivery:assigned	New Delivery Assignment	You have been assigned to deliver order #26	{"orderId":26,"deliveryId":2}	1	1	2025-03-04 11:55:53.488+00	2025-03-04 11:55:53.489+00	f
98	delivery:assigned	New Delivery Assignment	You have been assigned to deliver order #22	{"orderId":22,"deliveryId":3}	1	1	2025-03-04 12:01:46.123+00	2025-03-04 12:01:46.124+00	f
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.order_items (id, order_id, product_id, quantity, unit_price, created_at, updated_at) FROM stdin;
1	3	55	3	463.85	2025-01-17 16:35:31.443+00	2025-01-17 16:35:31.444+00
2	3	54	1	605.29	2025-01-17 16:35:31.55+00	2025-01-17 16:35:31.55+00
3	3	53	1	480.99	2025-01-17 16:35:31.653+00	2025-01-17 16:35:31.653+00
4	4	205	1	946.45	2025-01-17 16:39:40.733+00	2025-01-17 16:39:40.733+00
5	5	55	1	463.85	2025-01-20 12:17:07.36+00	2025-01-20 12:17:07.36+00
6	5	54	2	605.29	2025-01-20 12:17:07.454+00	2025-01-20 12:17:07.454+00
7	6	55	1	463.85	2025-01-20 12:30:21.466+00	2025-01-20 12:30:21.466+00
8	7	228	1	576.09	2025-01-20 13:31:20.15+00	2025-01-20 13:31:20.151+00
9	7	231	1	905.90	2025-01-20 13:31:20.245+00	2025-01-20 13:31:20.245+00
10	7	227	1	413.99	2025-01-20 13:31:20.329+00	2025-01-20 13:31:20.329+00
11	8	200	1	671.85	2025-01-20 14:37:51.031+00	2025-01-20 14:37:51.031+00
12	8	128	2	758.99	2025-01-20 14:37:51.124+00	2025-01-20 14:37:51.124+00
13	8	129	1	572.20	2025-01-20 14:37:51.258+00	2025-01-20 14:37:51.258+00
14	9	228	2	576.09	2025-01-21 12:35:48.716+00	2025-01-21 12:35:48.716+00
15	12	129	2	572.20	2025-01-24 13:31:48.783+00	2025-01-24 13:31:48.785+00
16	12	127	1	336.61	2025-01-24 13:31:48.929+00	2025-01-24 13:31:48.929+00
17	16	228	1	576.09	2025-01-27 12:07:33.908+00	2025-01-27 12:07:33.908+00
18	16	231	1	905.90	2025-01-27 12:07:34.001+00	2025-01-27 12:07:34.001+00
19	17	54	1	605.29	2025-01-27 13:44:40.187+00	2025-01-27 13:44:40.187+00
20	17	55	1	463.85	2025-01-27 13:44:40.286+00	2025-01-27 13:44:40.286+00
21	18	55	1	463.85	2025-01-29 12:07:16.057+00	2025-01-29 12:07:16.057+00
22	18	54	1	605.29	2025-01-29 12:07:16.15+00	2025-01-29 12:07:16.15+00
23	19	129	1	572.20	2025-01-29 12:59:07.129+00	2025-01-29 12:59:07.13+00
24	19	128	1	758.99	2025-01-29 12:59:07.216+00	2025-01-29 12:59:07.216+00
25	20	200	1	671.85	2025-01-29 13:07:05.374+00	2025-01-29 13:07:05.375+00
26	20	202	2	454.69	2025-01-29 13:07:05.457+00	2025-01-29 13:07:05.457+00
27	21	129	2	572.20	2025-02-04 12:10:42.787+00	2025-02-04 12:10:42.787+00
28	21	128	1	758.99	2025-02-04 12:10:42.875+00	2025-02-04 12:10:42.875+00
29	22	228	2	576.09	2025-02-04 12:20:50.466+00	2025-02-04 12:20:50.466+00
31	24	55	1	463.85	2025-02-05 11:43:50.188+00	2025-02-05 11:43:50.188+00
32	25	55	2	463.85	2025-02-06 13:03:40.088+00	2025-02-06 13:03:40.088+00
33	25	54	6	605.29	2025-02-06 13:03:40.176+00	2025-02-06 13:03:40.176+00
34	26	228	2	576.09	2025-02-06 13:58:26.107+00	2025-02-06 13:58:26.108+00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.orders (id, user_id, tenant_id, payment_method, subtotal, delivery_fee, total, address_id, status, created_at, updated_at) FROM stdin;
3	16	1	cash	2477.83	1000.00	3477.83	1	pending	2025-01-17 16:35:31.295+00	2025-01-17 16:35:31.295+00
8	16	1	cash	2762.03	1000.00	3762.03	2	cancelled	2025-01-20 14:37:50.944+00	2025-01-20 14:41:33.282+00
7	16	1	cash	1895.98	1000.00	2895.98	2	processing	2025-01-20 13:31:20.036+00	2025-01-20 14:42:09.004+00
9	16	1	cash	1152.18	1000.00	2152.18	2	shipped	2025-01-21 12:35:48.585+00	2025-01-24 11:21:51.977+00
6	16	1	cash	463.85	1000.00	1463.85	2	delivered	2025-01-20 12:30:21.379+00	2025-01-24 11:25:59.436+00
5	16	1	cash	1674.43	1000.00	2674.43	1	shipped	2025-01-20 12:17:07.253+00	2025-01-24 12:27:09.558+00
12	16	1	cash	1481.01	1000.00	2481.01	2	pending	2025-01-24 13:31:48.337+00	2025-01-24 13:31:48.337+00
4	16	1	cash	946.45	1000.00	1946.45	1	delivered	2025-01-17 16:39:40.654+00	2025-01-24 16:35:08.161+00
16	16	1	cash	1481.99	1000.00	2481.99	2	shipped	2025-01-27 12:07:33.583+00	2025-01-29 12:05:09.017+00
18	17	1	cash	1069.14	1000.00	2069.14	1	cancelled	2025-01-29 12:07:15.942+00	2025-01-29 12:42:04.841+00
17	17	1	cash	1069.14	1000.00	2069.14	2	cancelled	2025-01-27 13:44:39.778+00	2025-01-29 12:47:50.069+00
20	17	1	cash	1581.23	1000.00	2581.23	1	delivered	2025-01-29 13:07:05.297+00	2025-01-29 13:24:16.348+00
19	17	1	cash	1331.19	1000.00	2331.19	1	delivered	2025-01-29 12:59:07.045+00	2025-01-29 15:22:14.209+00
21	17	1	cash	1903.39	1000.00	2903.39	1	pending	2025-02-04 12:10:42.692+00	2025-02-04 12:10:42.693+00
22	17	1	cash	1152.18	1000.00	2152.18	1	pending	2025-02-04 12:20:50.378+00	2025-02-04 12:20:50.379+00
24	17	1	cash	463.85	1000.00	1463.85	1	shipped	2025-02-05 11:43:50.108+00	2025-02-05 14:05:18.197+00
25	17	1	cash	4559.44	1000.00	5559.44	1	delivered	2025-02-06 13:03:39.974+00	2025-02-06 13:24:08.83+00
26	17	1	cash	1152.18	1000.00	2152.18	1	pending	2025-02-06 13:58:26.01+00	2025-02-06 13:58:26.01+00
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.payments (id, order_id, payment_method, status, transaction_id, amount, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.permissions (id, resource, action, tenant_id, created_at, updated_at, resource_id, scope) FROM stdin;
4	tenants	delete	\N	2025-01-16 14:57:32.681+00	2025-01-16 14:57:32.681+00	1	all
3	tenants	update	\N	2025-01-16 14:57:32.585+00	2025-01-16 14:57:32.585+00	1	all
2	tenants	read	\N	2025-01-16 14:57:32.488+00	2025-01-16 14:57:32.488+00	1	all
1	tenants	create	\N	2025-01-16 14:57:32.254+00	2025-01-16 14:57:32.264+00	1	all
25	dashboard	read	\N	2025-01-16 14:57:34.646+00	2025-01-16 14:57:34.646+00	3	all
12	orders	delete	\N	2025-01-16 14:57:33.479+00	2025-01-16 14:57:33.48+00	4	all
11	orders	update	\N	2025-01-16 14:57:33.387+00	2025-01-16 14:57:33.388+00	4	all
10	orders	read	\N	2025-01-16 14:57:33.297+00	2025-01-16 14:57:33.297+00	4	all
9	orders	create	\N	2025-01-16 14:57:33.187+00	2025-01-16 14:57:33.187+00	4	all
24	permissions	delete	\N	2025-01-16 14:57:34.563+00	2025-01-16 14:57:34.563+00	5	all
23	permissions	update	\N	2025-01-16 14:57:34.475+00	2025-01-16 14:57:34.475+00	5	all
22	permissions	read	\N	2025-01-16 14:57:34.385+00	2025-01-16 14:57:34.386+00	5	all
21	permissions	create	\N	2025-01-16 14:57:34.292+00	2025-01-16 14:57:34.292+00	5	all
29	products	delete	\N	2025-01-16 14:57:34.992+00	2025-01-16 14:57:34.992+00	6	all
27	products	read	\N	2025-01-16 14:57:34.829+00	2025-01-16 14:57:34.829+00	6	all
26	products	create	\N	2025-01-16 14:57:34.736+00	2025-01-16 14:57:34.736+00	6	all
8	products	delete	\N	2025-01-16 14:57:33.081+00	2025-01-16 14:57:33.082+00	6	all
7	products	update	\N	2025-01-16 14:57:32.984+00	2025-01-16 14:57:32.984+00	6	all
6	products	read	\N	2025-01-16 14:57:32.886+00	2025-01-16 14:57:32.886+00	6	all
5	products	create	\N	2025-01-16 14:57:32.784+00	2025-01-16 14:57:32.786+00	6	all
20	roles	delete	\N	2025-01-16 14:57:34.202+00	2025-01-16 14:57:34.202+00	7	all
19	roles	update	\N	2025-01-16 14:57:34.097+00	2025-01-16 14:57:34.097+00	7	all
18	roles	read	\N	2025-01-16 14:57:33.998+00	2025-01-16 14:57:33.998+00	7	all
17	roles	create	\N	2025-01-16 14:57:33.913+00	2025-01-16 14:57:33.913+00	7	all
16	users	delete	\N	2025-01-16 14:57:33.824+00	2025-01-16 14:57:33.824+00	9	all
15	users	update	\N	2025-01-16 14:57:33.737+00	2025-01-16 14:57:33.737+00	9	all
14	users	read	\N	2025-01-16 14:57:33.652+00	2025-01-16 14:57:33.652+00	9	all
13	users	create	\N	2025-01-16 14:57:33.564+00	2025-01-16 14:57:33.564+00	9	all
31	resources	create	1	2025-02-28 11:21:18.133+00	2025-02-28 11:21:18.133+00	12	all
32	deliveries	create	1	2025-02-28 11:29:07.003+00	2025-02-28 11:29:07.003+00	10	all
33	deliveries	read	1	2025-02-28 11:29:17.902+00	2025-02-28 11:29:17.902+00	10	all
34	deliveries	update	1	2025-02-28 11:29:31.578+00	2025-02-28 11:29:31.578+00	10	all
35	deliveries	delete	1	2025-02-28 11:29:46.296+00	2025-02-28 11:29:46.296+00	10	all
36	menus	read	1	2025-02-28 11:35:29.209+00	2025-02-28 11:35:29.209+00	\N	all
37	menus	update	1	2025-02-28 11:35:29.287+00	2025-02-28 11:35:29.287+00	\N	all
38	menus	delete	1	2025-02-28 11:35:29.366+00	2025-02-28 11:35:29.366+00	\N	all
39	menus	create	1	2025-02-28 11:35:29.445+00	2025-02-28 11:35:29.445+00	\N	all
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.product_images (id, url, filename, alt_text, is_cover, display_order, product_id, created_at, updated_at) FROM stdin;
265	https://loremflickr.com/2164/3777?lock=8109044309839698	aa5520a4-57d9-4460-b996-597b4cf6c280.jpg	Innovative Salad featuring colorless technology and Cotton construction	f	1	90	2025-01-16 15:50:45.996+00	2025-01-16 15:50:45.997+00
266	https://picsum.photos/seed/fMS2vZso1/1304/737	f9488550-f429-4a5d-ba27-78ec6afe6feb.jpg	Savor the salty essence in our Hat, designed for cavernous culinary adventures	f	2	90	2025-01-16 15:50:46.089+00	2025-01-16 15:50:46.089+00
267	https://loremflickr.com/1509/709?lock=3122113816310649	28763814-a1ba-4e40-8bec-14c7d865c1e2.jpg	The sky blue Hat combines Monaco aesthetics with Mendelevium-based durability	f	2	90	2025-01-16 15:50:46.178+00	2025-01-16 15:50:46.179+00
268	https://picsum.photos/seed/dDs0a/688/2874	7b59d978-b9f6-4362-9463-10bea80980c0.jpg	Professional-grade Shoes perfect for dull training and recreational use	f	5	91	2025-01-16 15:50:46.362+00	2025-01-16 15:50:46.363+00
269	https://picsum.photos/seed/enWik2/653/3493	92702880-26d1-4687-af0c-64b1837e7cf6.jpg	The Geraldine Computer is the latest in a series of carefree products from Hegmann, Parker and Tillman	f	9	91	2025-01-16 15:50:46.452+00	2025-01-16 15:50:46.452+00
270	https://loremflickr.com/149/953?lock=7079652054480925	2251f1da-6429-4be1-835d-8e5cb17acbc4.jpg	The Jalen Fish is the latest in a series of rare products from Zieme - Schoen	f	3	91	2025-01-16 15:50:46.542+00	2025-01-16 15:50:46.542+00
271	https://loremflickr.com/3518/1286?lock=3673924718176253	b068ff79-bec0-49e6-9502-61ce56fb6ca3.jpg	Discover the hippopotamus-like agility of our Fish, perfect for whirlwind users	f	3	92	2025-01-16 15:50:46.727+00	2025-01-16 15:50:46.727+00
272	https://picsum.photos/seed/SWBymc7jo/3090/3458	36fccd62-aa0a-4cee-a2a3-71f76c610f44.jpg	Stylish Fish designed to make you stand out with intelligent looks	f	7	92	2025-01-16 15:50:46.813+00	2025-01-16 15:50:46.813+00
273	https://loremflickr.com/1388/562?lock=4151221848404077	ab3f9d7e-d417-4ad9-90e1-8191ac56e7c6.jpg	Introducing the Andorra-inspired Table, blending measly style with local craftsmanship	f	5	92	2025-01-16 15:50:46.896+00	2025-01-16 15:50:46.896+00
274	https://picsum.photos/seed/wW8qa9p/3187/686	6f84e0ad-c2eb-46be-89d3-1df850d625a6.jpg	Featuring Uranium-enhanced technology, our Computer offers unparalleled trusty performance	f	8	93	2025-01-16 15:50:47.07+00	2025-01-16 15:50:47.07+00
275	https://loremflickr.com/279/2049?lock=7339004691227507	a271c0eb-8b1d-4aef-923a-97fb6080773c.jpg	Professional-grade Car perfect for caring training and recreational use	f	9	93	2025-01-16 15:50:47.158+00	2025-01-16 15:50:47.158+00
276	https://picsum.photos/seed/oTtEwJ2i8V/2297/3933	965fccaf-393a-4988-941c-009cea9e90bd.jpg	New Bike model with 4 GB RAM, 350 GB storage, and watery features	f	2	93	2025-01-16 15:50:47.247+00	2025-01-16 15:50:47.247+00
277	https://loremflickr.com/311/1344?lock=4940342425922335	d8ce8e4f-c8b7-47dc-a4a9-f3615bf87886.jpg	Featuring Boron-enhanced technology, our Chicken offers unparalleled unlined performance	f	8	94	2025-01-16 15:50:47.426+00	2025-01-16 15:50:47.426+00
278	https://loremflickr.com/873/2832?lock=8230913577349133	75834f8f-d345-4597-b5d8-0f31f1f4dc24.jpg	The violet Car combines Uruguay aesthetics with Astatine-based durability	f	1	94	2025-01-16 15:50:47.513+00	2025-01-16 15:50:47.513+00
279	https://loremflickr.com/2135/1075?lock=6032205165396254	643a8649-4db1-45fc-9dd5-32b0dbea12dc.jpg	New Car model with 66 GB RAM, 252 GB storage, and whole features	f	1	94	2025-01-16 15:50:47.602+00	2025-01-16 15:50:47.602+00
280	https://loremflickr.com/3489/145?lock=1962051664875563	42dafd44-cf6f-401c-b380-01a3a7f09e5c.jpg	Stylish Car designed to make you stand out with strict looks	f	10	95	2025-01-16 15:50:47.782+00	2025-01-16 15:50:47.782+00
281	https://picsum.photos/seed/HJdZqFq1/2796/1891	a3852cdc-0c6c-4a4f-99f6-6e0ca68c0234.jpg	Experience the black brilliance of our Chair, perfect for bouncy environments	f	0	95	2025-01-16 15:50:47.879+00	2025-01-16 15:50:47.879+00
282	https://picsum.photos/seed/uhBJtnG/1450/791	3a9cc055-9f5f-43c2-bd5b-99dbe3117580.jpg	Our sour-inspired Chicken brings a taste of luxury to your disloyal lifestyle	f	4	95	2025-01-16 15:50:47.974+00	2025-01-16 15:50:47.974+00
283	https://picsum.photos/seed/928WWmr/2183/1960	70dca979-039f-413e-b76a-2e98af07b565.jpg	Our polar bear-friendly Table ensures scientific comfort for your pets	f	1	96	2025-01-16 15:50:48.154+00	2025-01-16 15:50:48.154+00
284	https://picsum.photos/seed/W1Jq9jm6Bd/1206/582	778b2e15-94f7-4382-9184-cc0407ca6515.jpg	The sleek and clueless Sausages comes with black LED lighting for smart functionality	f	10	96	2025-01-16 15:50:48.244+00	2025-01-16 15:50:48.244+00
285	https://loremflickr.com/461/43?lock=2091712203679118	d5c38089-1a8e-49dc-9d9e-4ab302901055.jpg	Schamberger LLC's most advanced Car technology increases tense capabilities	f	8	96	2025-01-16 15:50:48.341+00	2025-01-16 15:50:48.341+00
286	https://loremflickr.com/3993/991?lock=5974526700751923	bd4a0087-38ea-4a31-9b25-d9d9e6517d79.jpg	Professional-grade Ball perfect for marvelous training and recreational use	f	1	97	2025-01-16 15:50:48.516+00	2025-01-16 15:50:48.516+00
287	https://picsum.photos/seed/axNYSw6Ry/385/3681	42f87fc4-a0d7-4227-904e-13780f33b815.jpg	Our bat-friendly Mouse ensures glum comfort for your pets	f	7	97	2025-01-16 15:50:48.595+00	2025-01-16 15:50:48.595+00
288	https://loremflickr.com/1482/1423?lock=4458781641565355	8e15d7cc-d72d-4e03-b097-f12286a4ccea.jpg	Stylish Bacon designed to make you stand out with webbed looks	f	0	97	2025-01-16 15:50:48.675+00	2025-01-16 15:50:48.676+00
289	https://picsum.photos/seed/WJJrjTkBYO/1715/794	cda0c456-d664-4864-9c67-5ce5cf12c7c2.jpg	Experience the lavender brilliance of our Fish, perfect for impossible environments	f	3	98	2025-01-16 15:50:48.851+00	2025-01-16 15:50:48.851+00
290	https://picsum.photos/seed/UMtWpn42fx/930/1022	ca36530a-15d1-450e-b2e4-7286c8d9e801.jpg	The sleek and shameful Hat comes with teal LED lighting for smart functionality	f	1	98	2025-01-16 15:50:48.929+00	2025-01-16 15:50:48.929+00
291	https://picsum.photos/seed/WIAxz/1556/3694	d20bf610-a1e3-4786-8dfb-a944a57da7f2.jpg	Our golden-inspired Chips brings a taste of luxury to your glass lifestyle	f	5	98	2025-01-16 15:50:49.009+00	2025-01-16 15:50:49.009+00
292	https://picsum.photos/seed/el8Y4ZL6yj/1743/2225	1c9d8264-fd28-4bbf-8229-9792ee2ba753.jpg	Savor the moist essence in our Chicken, designed for untried culinary adventures	f	6	99	2025-01-16 15:50:49.188+00	2025-01-16 15:50:49.188+00
293	https://picsum.photos/seed/iYCd3r7Sg/2331/2535	e1b906d5-47e7-4b31-a6b1-191b157885af.jpg	Stylish Shoes designed to make you stand out with nifty looks	f	4	99	2025-01-16 15:50:49.278+00	2025-01-16 15:50:49.278+00
294	https://loremflickr.com/3862/401?lock=2525137054409690	e84cf33d-8655-4410-a238-daa7ac5990ca.jpg	Introducing the Sweden-inspired Salad, blending key style with local craftsmanship	f	4	99	2025-01-16 15:50:49.368+00	2025-01-16 15:50:49.368+00
295	https://picsum.photos/seed/o4LwOriKzv/1572/3837	22dd68c9-ab94-44ba-9048-a81c695d0f57.jpg	Green, Cronin and Adams's most advanced Salad technology increases jealous capabilities	f	0	100	2025-01-16 15:50:49.542+00	2025-01-16 15:50:49.542+00
296	https://loremflickr.com/3168/117?lock=7210441468388784	45cef064-40fc-478c-b7d7-172dfbff4905.jpg	New azure Pizza with ergonomic design for blaring comfort	f	7	100	2025-01-16 15:50:49.632+00	2025-01-16 15:50:49.632+00
297	https://loremflickr.com/525/1867?lock=8133285008815944	24bb18de-fc6a-4e4a-b75e-69a3543166b1.jpg	D'Amore Inc's most advanced Chips technology increases idolized capabilities	f	3	100	2025-01-16 15:50:49.727+00	2025-01-16 15:50:49.728+00
298	https://loremflickr.com/3083/1935?lock=7353692238021736	003fb5d9-d982-4d0f-8065-5c0106daba85.jpg	Introducing the Lesotho-inspired Ball, blending magnificent style with local craftsmanship	f	7	101	2025-01-16 15:50:52.909+00	2025-01-16 15:50:52.91+00
299	https://loremflickr.com/3090/1759?lock=999721173458538	8ea14700-6ae2-42ba-93ee-bb2efc60c2b3.jpg	The Programmable encompassing middleware Pants offers reliable performance and able design	f	6	101	2025-01-16 15:50:52.998+00	2025-01-16 15:50:52.998+00
300	https://loremflickr.com/3541/3473?lock=3183907439966770	bcc084bc-64c1-4d85-b255-e4f800c6506c.jpg	Savor the delicious essence in our Chips, designed for regular culinary adventures	f	5	101	2025-01-16 15:50:53.088+00	2025-01-16 15:50:53.088+00
301	https://loremflickr.com/3586/915?lock=2333345816251721	9f994ae8-a5de-424c-a1e1-2e51f473c3f0.jpg	New Computer model with 52 GB RAM, 732 GB storage, and blaring features	f	0	102	2025-01-16 15:50:53.268+00	2025-01-16 15:50:53.268+00
302	https://picsum.photos/seed/DkZSvWCVty/458/3475	26ff2dc8-bcad-402f-851a-c07d8407a187.jpg	Savor the tangy essence in our Chips, designed for mean culinary adventures	f	3	102	2025-01-16 15:50:53.351+00	2025-01-16 15:50:53.351+00
303	https://picsum.photos/seed/ssQwOvxR3/109/3505	cb61fbed-a1e9-45e2-ba3b-576fc88877d1.jpg	Introducing the Seychelles-inspired Chips, blending husky style with local craftsmanship	f	9	102	2025-01-16 15:50:53.44+00	2025-01-16 15:50:53.44+00
304	https://picsum.photos/seed/TTiMqVFQH/2675/3135	6e8f17b4-5db7-40bf-8648-bbbf40c418d8.jpg	Ergonomic Shirt made with Fresh for all-day snappy support	f	4	103	2025-01-16 15:50:53.62+00	2025-01-16 15:50:53.62+00
305	https://picsum.photos/seed/EyD7fmdbHE/851/3299	a68db28b-613a-468d-b63d-0ded13022ce9.jpg	Discover the wolf-like agility of our Sausages, perfect for husky users	f	2	103	2025-01-16 15:50:53.707+00	2025-01-16 15:50:53.707+00
306	https://picsum.photos/seed/idNKRxOb4j/2114/144	ab08b3bd-c4f5-4bec-be2c-1e8018340654.jpg	Featuring Niobium-enhanced technology, our Sausages offers unparalleled youthful performance	f	9	103	2025-01-16 15:50:53.794+00	2025-01-16 15:50:53.794+00
307	https://picsum.photos/seed/YD5G6xnDlb/1148/1102	5ef2174a-3989-4645-8486-b8260970769d.jpg	Innovative Table featuring robust technology and Rubber construction	f	7	104	2025-01-16 15:50:53.963+00	2025-01-16 15:50:53.963+00
308	https://picsum.photos/seed/QMnZzKX/1383/767	df815ca2-8b71-4fff-ba78-f8ae1c04b503.jpg	The red Gloves combines Cuba aesthetics with Polonium-based durability	f	7	104	2025-01-16 15:50:54.051+00	2025-01-16 15:50:54.051+00
309	https://picsum.photos/seed/dtmBwdwufb/752/2839	1fc6efd3-c6db-46b1-ba7d-d74be8f444c2.jpg	Anderson Group's most advanced Fish technology increases enlightened capabilities	f	0	104	2025-01-16 15:50:54.139+00	2025-01-16 15:50:54.139+00
310	https://picsum.photos/seed/4y8Ahp/1267/1588	12203cef-55bc-4dee-858e-0a83755b37af.jpg	Featuring Magnesium-enhanced technology, our Towels offers unparalleled comfortable performance	f	0	105	2025-01-16 15:50:54.315+00	2025-01-16 15:50:54.316+00
311	https://picsum.photos/seed/fY3r6yV/1999/3064	6534cd40-c4c5-4cb8-98f0-9874c12484f7.jpg	Professional-grade Shoes perfect for granular training and recreational use	f	3	105	2025-01-16 15:50:54.394+00	2025-01-16 15:50:54.394+00
312	https://picsum.photos/seed/Ixqmy1skub/289/3668	1d163291-b6d6-4950-b0b4-40392cef1dbd.jpg	Savor the crispy essence in our Bacon, designed for multicolored culinary adventures	f	4	105	2025-01-16 15:50:54.474+00	2025-01-16 15:50:54.474+00
313	https://loremflickr.com/2271/1666?lock=3861670476632378	64f925cd-8df3-482d-80f2-5d225a5ec625.jpg	Our deer-friendly Shirt ensures crowded comfort for your pets	f	6	106	2025-01-16 15:50:54.654+00	2025-01-16 15:50:54.654+00
314	https://loremflickr.com/284/639?lock=3028885039857836	ceb35fc4-676e-4603-9e87-31d9c3e067cf.jpg	New Chips model with 62 GB RAM, 397 GB storage, and querulous features	f	7	106	2025-01-16 15:50:54.744+00	2025-01-16 15:50:54.744+00
315	https://loremflickr.com/1620/100?lock=5089997566119717	a37c28c6-15ee-4ddc-9f46-b3fd7fc26586.jpg	Stylish Ball designed to make you stand out with far-flung looks	f	1	106	2025-01-16 15:50:54.842+00	2025-01-16 15:50:54.842+00
316	https://loremflickr.com/2078/2381?lock=22603421633774	f684e547-2e5b-49ee-bfe0-88cfebbdfb03.jpg	Innovative Mouse featuring basic technology and Metal construction	f	4	107	2025-01-16 15:50:55.017+00	2025-01-16 15:50:55.017+00
317	https://picsum.photos/seed/sqQoRWOB8/324/984	854eb6a5-e519-4326-baff-8780235830a7.jpg	Jones, Langosh and Smitham's most advanced Keyboard technology increases failing capabilities	f	9	107	2025-01-16 15:50:55.104+00	2025-01-16 15:50:55.104+00
318	https://loremflickr.com/3150/432?lock=2195867131522937	92045f22-b8ea-4583-9f4d-571dbe9a4af7.jpg	Innovative Pants featuring agreeable technology and Steel construction	f	5	107	2025-01-16 15:50:55.194+00	2025-01-16 15:50:55.194+00
319	https://loremflickr.com/3354/4?lock=3754741749258744	1a4ab282-3761-41be-bac8-f9baea213782.jpg	Discover the unwelcome new Keyboard with an exciting mix of Rubber ingredients	f	5	108	2025-01-16 15:50:55.36+00	2025-01-16 15:50:55.36+00
320	https://loremflickr.com/3486/2810?lock=2486497351861188	45098008-aaa9-41e1-af5f-3806bb6e55b0.jpg	Experience the gold brilliance of our Mouse, perfect for charming environments	f	0	108	2025-01-16 15:50:55.451+00	2025-01-16 15:50:55.451+00
321	https://loremflickr.com/1997/525?lock=2039935395541383	590b7e06-9aed-474f-8788-f18a52cd36ab.jpg	Ergonomic Soap made with Steel for all-day classic support	f	1	108	2025-01-16 15:50:55.547+00	2025-01-16 15:50:55.548+00
322	https://loremflickr.com/3052/2817?lock=6248428403584775	462adff8-dd8c-4d81-bd7f-dc75b889c478.jpg	Recycled Bike designed with Bronze for determined performance	f	2	109	2025-01-16 15:50:55.725+00	2025-01-16 15:50:55.725+00
323	https://loremflickr.com/1127/3911?lock=1520827302456524	6298decb-7c89-4f46-83cd-f638fe4a4668.jpg	Stylish Pizza designed to make you stand out with zesty looks	f	2	109	2025-01-16 15:50:55.812+00	2025-01-16 15:50:55.812+00
324	https://loremflickr.com/3744/1307?lock=8991222092666954	fd7f8d2c-3d87-4057-acb1-d029862ea6cc.jpg	The Dario Shoes is the latest in a series of grimy products from Predovic, Wiza and Funk	f	3	109	2025-01-16 15:50:55.892+00	2025-01-16 15:50:55.892+00
325	https://picsum.photos/seed/70pFBRohS/2178/2537	35060898-a8ac-411e-9af8-dd213a65fc8c.jpg	Discover the bird-like agility of our Pants, perfect for brown users	f	5	110	2025-01-16 15:50:56.061+00	2025-01-16 15:50:56.061+00
326	https://loremflickr.com/2099/2283?lock=5816851065716201	2392ae23-4c42-4fe0-9354-71f6684172ee.jpg	Bespoke Towels designed with Wooden for timely performance	f	4	110	2025-01-16 15:50:56.163+00	2025-01-16 15:50:56.163+00
327	https://loremflickr.com/3277/792?lock=3508108375364851	ec732c1d-e5a3-49f5-9883-03781fc4aa3a.jpg	Discover the pitiful new Pants with an exciting mix of Steel ingredients	f	2	110	2025-01-16 15:50:56.246+00	2025-01-16 15:50:56.247+00
328	https://picsum.photos/seed/bFaBKPCLD/3579/1346	068f2c14-a5d5-4048-8f23-bd1b8108e63f.jpg	Discover the untimely new Cheese with an exciting mix of Fresh ingredients	f	0	111	2025-01-16 15:50:56.412+00	2025-01-16 15:50:56.412+00
329	https://picsum.photos/seed/YzV3UQ/178/239	619b1882-b768-469c-a1bd-d7b7fc936a28.jpg	Experience the sky blue brilliance of our Soap, perfect for plump environments	f	5	111	2025-01-16 15:50:56.493+00	2025-01-16 15:50:56.493+00
330	https://loremflickr.com/121/770?lock=8758228978772816	86fb5bbe-0dd3-4301-8b38-c903396111a5.jpg	Discover the impressionable new Pizza with an exciting mix of Plastic ingredients	f	10	111	2025-01-16 15:50:56.59+00	2025-01-16 15:50:56.59+00
331	https://loremflickr.com/3094/2373?lock=7501917441233667	696c7b26-abaf-49c4-8892-cd2bb7e33bc7.jpg	Stylish Ball designed to make you stand out with oddball looks	f	7	112	2025-01-16 15:50:56.78+00	2025-01-16 15:50:56.78+00
332	https://loremflickr.com/454/1417?lock=1575367471006799	e7a27893-6e43-4bd3-8ed6-b24204d997e2.jpg	Ergonomic Mouse made with Granite for all-day taut support	f	1	112	2025-01-16 15:50:56.866+00	2025-01-16 15:50:56.866+00
333	https://picsum.photos/seed/wF58B/870/2879	6b2df731-0496-46ee-a399-f63e109bb586.jpg	Stylish Chicken designed to make you stand out with sizzling looks	f	6	112	2025-01-16 15:50:56.949+00	2025-01-16 15:50:56.949+00
334	https://picsum.photos/seed/W5xLCnCXlv/1579/1068	c0d3a7cc-0fc0-4c30-b677-f132e1a17a34.jpg	Heller - Rodriguez's most advanced Soap technology increases whirlwind capabilities	f	1	113	2025-01-16 15:50:57.122+00	2025-01-16 15:50:57.122+00
335	https://picsum.photos/seed/s52nHoLF/3404/736	9949b75f-e12b-4df9-ae2d-65e3a51f9796.jpg	Ergonomic Bacon made with Metal for all-day incomplete support	f	1	113	2025-01-16 15:50:57.208+00	2025-01-16 15:50:57.208+00
336	https://picsum.photos/seed/IU1ZM5fcwH/74/1798	b3409c5c-a2d7-4eb1-ad4c-65da4aa7d8e2.jpg	The lime Ball combines Isle of Man aesthetics with Astatine-based durability	f	2	113	2025-01-16 15:50:57.374+00	2025-01-16 15:50:57.375+00
337	https://loremflickr.com/3900/2596?lock=1418494600976194	351a9cec-61fe-47fa-a236-bd9fa584d29c.jpg	The blue Hat combines South Sudan aesthetics with Phosphorus-based durability	f	0	114	2025-01-16 15:50:57.956+00	2025-01-16 15:50:57.957+00
338	https://picsum.photos/seed/tLYYbq/2931/1421	2c5417e9-61c1-4138-ba5b-0ca8aa871df5.jpg	Introducing the Bonaire, Sint Eustatius and Saba-inspired Tuna, blending definite style with local craftsmanship	f	9	114	2025-01-16 15:50:58.048+00	2025-01-16 15:50:58.048+00
339	https://loremflickr.com/2732/2453?lock=1969097438381787	669b680f-f3e0-447d-b895-bdcb04a5c4cc.jpg	New green Tuna with ergonomic design for gripping comfort	f	0	114	2025-01-16 15:50:58.198+00	2025-01-16 15:50:58.198+00
340	https://picsum.photos/seed/jhXcYgfn/3265/117	f6cbca1b-0168-4f81-839b-3b1fccdf6c97.jpg	Stylish Pants designed to make you stand out with essential looks	f	6	115	2025-01-16 15:50:58.412+00	2025-01-16 15:50:58.412+00
341	https://picsum.photos/seed/1NRJE/530/3145	1200796e-6af5-4d15-85db-aae703e73db3.jpg	Professional-grade Pizza perfect for utter training and recreational use	f	4	115	2025-01-16 15:50:58.811+00	2025-01-16 15:50:58.812+00
342	https://loremflickr.com/1638/181?lock=1755758704464459	40876bbc-b1a9-419f-b033-d0e3c5514296.jpg	Innovative Salad featuring ultimate technology and Frozen construction	f	2	115	2025-01-16 15:50:58.991+00	2025-01-16 15:50:58.991+00
343	https://loremflickr.com/2104/3893?lock=4248573326947482	a2a26c2e-28ae-44eb-8ac8-69f7b97d2b4f.jpg	Featuring Beryllium-enhanced technology, our Tuna offers unparalleled unkempt performance	f	0	116	2025-01-16 15:51:03.747+00	2025-01-16 15:51:03.747+00
344	https://picsum.photos/seed/4a9DJ/3733/781	54c9624e-c7ad-48cf-87ff-359434bea794.jpg	The ivory Chair combines Myanmar aesthetics with Francium-based durability	f	0	116	2025-01-16 15:51:03.834+00	2025-01-16 15:51:03.834+00
345	https://loremflickr.com/3554/307?lock=1917644555955375	37e7d20e-e301-4244-9e3b-8f7cc086ae08.jpg	The orange Cheese combines Argentina aesthetics with Radon-based durability	f	6	116	2025-01-16 15:51:03.916+00	2025-01-16 15:51:03.916+00
346	https://loremflickr.com/1055/1297?lock=1026522964377978	ad6441cd-773c-491e-bbf1-8d485005188e.jpg	Featuring Rhenium-enhanced technology, our Cheese offers unparalleled pleasant performance	f	0	117	2025-01-16 15:51:04.074+00	2025-01-16 15:51:04.074+00
347	https://picsum.photos/seed/XyRTCVW3/2436/1644	d452924e-b5b8-446c-a7b8-e5d191e23294.jpg	New olive Salad with ergonomic design for vengeful comfort	f	6	117	2025-01-16 15:51:04.163+00	2025-01-16 15:51:04.163+00
348	https://picsum.photos/seed/LN4ajHak/3890/3267	bc6c7177-37a1-4061-9539-9c4cb8db8ad3.jpg	Recycled Car designed with Steel for amused performance	f	6	117	2025-01-16 15:51:04.251+00	2025-01-16 15:51:04.251+00
349	https://loremflickr.com/2799/108?lock=8357007401175635	49457ff8-9834-4f71-bfb7-6d102a855fbb.jpg	Featuring Ytterbium-enhanced technology, our Sausages offers unparalleled best performance	f	0	118	2025-01-16 15:51:04.428+00	2025-01-16 15:51:04.428+00
350	https://loremflickr.com/1278/901?lock=2110417173067452	dae50f8a-2eba-4112-9e0b-84659f74111a.jpg	Fantastic Bacon designed with Soft for fond performance	f	1	118	2025-01-16 15:51:04.509+00	2025-01-16 15:51:04.509+00
351	https://loremflickr.com/2502/3233?lock=4997650767280789	5223edd9-a431-46fa-ab43-e9c0bd5e98e7.jpg	The sleek and warm Bacon comes with fuchsia LED lighting for smart functionality	f	1	118	2025-01-16 15:51:04.595+00	2025-01-16 15:51:04.595+00
352	https://picsum.photos/seed/8wsLRTJ6/1300/892	51ef84bf-6c8a-4629-96ff-31585643d7e4.jpg	Awesome Ball designed with Plastic for growing performance	f	8	119	2025-01-16 15:51:04.762+00	2025-01-16 15:51:04.762+00
353	https://loremflickr.com/794/1885?lock=3432050364802054	4c8ff399-424f-49fa-a963-3d2e58a96eec.jpg	Innovative Shoes featuring some technology and Steel construction	f	3	119	2025-01-16 15:51:04.846+00	2025-01-16 15:51:04.846+00
354	https://loremflickr.com/408/1262?lock=7198896871040830	8148425e-b4da-4eb7-9beb-e13312b8bda3.jpg	The Face to face actuating core Bike offers reliable performance and negative design	f	9	119	2025-01-16 15:51:04.929+00	2025-01-16 15:51:04.929+00
355	https://loremflickr.com/776/3544?lock=8411876989088395	9aa4fc47-8c07-4822-a18e-8775fcbe6cf5.jpg	Stylish Towels designed to make you stand out with smoggy looks	f	2	120	2025-01-16 15:51:05.087+00	2025-01-16 15:51:05.087+00
356	https://loremflickr.com/3897/2028?lock=5592836939673920	d15d6a67-e5dd-4dc0-8b49-b61e82fa465e.jpg	Stylish Pants designed to make you stand out with petty looks	f	7	120	2025-01-16 15:51:05.166+00	2025-01-16 15:51:05.166+00
357	https://picsum.photos/seed/duEJFBcwa/3893/2098	79e9766c-fb7d-4929-a820-703275a24698.jpg	The lime Bacon combines Rwanda aesthetics with Livermorium-based durability	f	4	120	2025-01-16 15:51:05.247+00	2025-01-16 15:51:05.247+00
358	https://loremflickr.com/3677/1003?lock=1573254053916625	2d1f3a29-09f8-457f-bad3-d05abdeed929.jpg	New Gloves model with 12 GB RAM, 265 GB storage, and cute features	f	8	121	2025-01-16 15:51:05.424+00	2025-01-16 15:51:05.424+00
359	https://loremflickr.com/3879/333?lock=434177867008258	9ec33966-7094-4942-86c7-747638cb5ccc.jpg	Savor the smoky essence in our Ball, designed for entire culinary adventures	f	0	121	2025-01-16 15:51:05.513+00	2025-01-16 15:51:05.513+00
360	https://picsum.photos/seed/xAhST/2069/2984	e9de3f5c-9454-4cd0-9a8a-a02d066608c7.jpg	The Reactive scalable function Soap offers reliable performance and entire design	f	2	121	2025-01-16 15:51:05.6+00	2025-01-16 15:51:05.6+00
361	https://loremflickr.com/2489/2979?lock=6394441402226700	18dec4a6-2e93-4979-a3e9-b3165c678395.jpg	New Cheese model with 16 GB RAM, 855 GB storage, and shiny features	f	10	122	2025-01-16 15:51:05.786+00	2025-01-16 15:51:05.786+00
362	https://picsum.photos/seed/GQ09KDT/1379/1316	c898975e-7587-45da-a650-f291443a9049.jpg	Stylish Car designed to make you stand out with granular looks	f	2	122	2025-01-16 15:51:05.878+00	2025-01-16 15:51:05.878+00
363	https://loremflickr.com/3814/1807?lock=4270674473207512	ad5ed125-eae7-4254-a310-860281aabba7.jpg	Discover the bear-like agility of our Bike, perfect for basic users	f	8	122	2025-01-16 15:51:05.963+00	2025-01-16 15:51:05.963+00
364	https://picsum.photos/seed/IGvC4A0bGb/3068/66	5945aac1-71cf-4043-a83f-4e88fcb3c138.jpg	Introducing the Puerto Rico-inspired Salad, blending linear style with local craftsmanship	f	3	123	2025-01-16 15:51:06.13+00	2025-01-16 15:51:06.13+00
365	https://picsum.photos/seed/CSr8VqnH/2040/2075	04e2f2bf-6e4f-42d6-b2c4-25353315f690.jpg	Ergonomic Keyboard made with Metal for all-day buttery support	f	0	123	2025-01-16 15:51:06.21+00	2025-01-16 15:51:06.21+00
366	https://picsum.photos/seed/r2hBj6234/1498/423	0d23ed53-0459-4a63-b3a8-a4b739ad6154.jpg	Discover the koala-like agility of our Soap, perfect for likely users	f	5	123	2025-01-16 15:51:06.293+00	2025-01-16 15:51:06.294+00
367	https://loremflickr.com/3869/2718?lock=6777918381487981	8fce62e8-f381-425f-be16-efe9b2377596.jpg	Our cow-friendly Pizza ensures lost comfort for your pets	f	7	124	2025-01-16 15:51:06.456+00	2025-01-16 15:51:06.456+00
368	https://picsum.photos/seed/Qz7Ofk/17/872	89514617-e839-4a38-a260-75bac3067562.jpg	Professional-grade Towels perfect for whimsical training and recreational use	f	3	124	2025-01-16 15:51:06.535+00	2025-01-16 15:51:06.535+00
369	https://loremflickr.com/170/714?lock=8217811610730512	902b9016-bdc2-4859-a5b1-00f95be2f88a.jpg	Featuring Lead-enhanced technology, our Salad offers unparalleled unruly performance	f	5	124	2025-01-16 15:51:06.613+00	2025-01-16 15:51:06.613+00
370	https://loremflickr.com/3470/2807?lock=2565670240453636	9d44785e-b80b-4686-91d5-79fb52fda49b.jpg	Stylish Keyboard designed to make you stand out with second-hand looks	f	8	125	2025-01-16 15:51:06.793+00	2025-01-16 15:51:06.793+00
371	https://picsum.photos/seed/Q4qfon5Y/2791/3940	5f3202a0-8a8b-46fd-85da-fbc1a4362901.jpg	Kuhic and Sons's most advanced Tuna technology increases pastel capabilities	f	0	125	2025-01-16 15:51:06.879+00	2025-01-16 15:51:06.879+00
372	https://picsum.photos/seed/jzms5PHn/2941/104	3fe89a15-bfe2-4257-85f6-81e3f21df4dd.jpg	The Romaine Ball is the latest in a series of velvety products from Strosin - Labadie	f	5	125	2025-01-16 15:51:06.973+00	2025-01-16 15:51:06.973+00
373	https://picsum.photos/seed/iuboeFLLeo/2657/1745	d051ac8f-f15a-4e23-94f6-8592ad4e5603.jpg	The Luigi Pizza is the latest in a series of metallic products from Dare Group	f	5	126	2025-01-16 15:51:07.149+00	2025-01-16 15:51:07.149+00
374	https://loremflickr.com/2766/20?lock=1846162100572332	5a57811f-8032-47fe-9a4d-46fd4fb8cee1.jpg	Our parrot-friendly Chicken ensures measly comfort for your pets	f	4	126	2025-01-16 15:51:07.241+00	2025-01-16 15:51:07.241+00
375	https://picsum.photos/seed/UyiMq5p/2945/3739	2ffbe802-5264-446d-a40e-a1a6ae415055.jpg	Featuring Polonium-enhanced technology, our Bike offers unparalleled infamous performance	f	10	126	2025-01-16 15:51:07.323+00	2025-01-16 15:51:07.324+00
376	https://picsum.photos/seed/L1Xed/38/1764	eaff4b24-7002-4903-a167-7051a3578cf3.jpg	Innovative Chair featuring wrong technology and Wooden construction	f	1	127	2025-01-16 15:51:07.5+00	2025-01-16 15:51:07.5+00
377	https://picsum.photos/seed/DhJ4oPQonB/2750/991	aa5f9036-891e-4e3a-a268-4478a7f6ddf6.jpg	New Pants model with 24 GB RAM, 755 GB storage, and trim features	f	6	127	2025-01-16 15:51:07.606+00	2025-01-16 15:51:07.606+00
378	https://loremflickr.com/2111/1198?lock=1473382271162062	b219c797-34f4-4c7e-a209-bad9d0295051.jpg	Stylish Shoes designed to make you stand out with gorgeous looks	f	3	127	2025-01-16 15:51:07.686+00	2025-01-16 15:51:07.686+00
379	https://picsum.photos/seed/U1C6E8e/1890/2747	c1183893-a403-40ee-9c0d-d22d80e25025.jpg	Small Bacon designed with Wooden for baggy performance	f	0	128	2025-01-16 15:51:07.866+00	2025-01-16 15:51:07.866+00
380	https://loremflickr.com/1152/2305?lock=3397291887767206	961d1eff-74a5-444b-b85e-0be231a5ccc0.jpg	Introducing the Dominica-inspired Hat, blending our style with local craftsmanship	f	2	128	2025-01-16 15:51:07.952+00	2025-01-16 15:51:07.952+00
381	https://loremflickr.com/3976/3820?lock=6119460158241343	522df0c7-1641-4cbf-876e-13aebb533de4.jpg	Innovative Hat featuring warmhearted technology and Wooden construction	f	2	128	2025-01-16 15:51:08.031+00	2025-01-16 15:51:08.031+00
382	https://loremflickr.com/997/946?lock=2454543832473590	8afebe72-10ee-4f22-88eb-44ed5ca79c57.jpg	Our creamy-inspired Shirt brings a taste of luxury to your nifty lifestyle	f	1	129	2025-01-16 15:51:08.207+00	2025-01-16 15:51:08.207+00
383	https://loremflickr.com/3699/728?lock=4842645623910859	f22b12e5-3ddc-48b4-8ff9-00d0bf532987.jpg	Professional-grade Pizza perfect for blank training and recreational use	f	9	129	2025-01-16 15:51:08.287+00	2025-01-16 15:51:08.287+00
384	https://picsum.photos/seed/IiFxXHSVj/2937/1741	da509274-69d6-4095-9caf-520d19eeadd1.jpg	New Car model with 30 GB RAM, 29 GB storage, and outstanding features	f	6	129	2025-01-16 15:51:08.366+00	2025-01-16 15:51:08.366+00
385	https://picsum.photos/seed/3FBgoOWac/1834/2500	ac11e8f1-b5f8-4bff-9cbb-511f777d4c92.jpg	Schneider - Ward's most advanced Sausages technology increases animated capabilities	f	1	130	2025-01-16 15:51:12.247+00	2025-01-16 15:51:12.247+00
386	https://picsum.photos/seed/U7j3eSX/661/8	962d22eb-3fbb-4596-b1eb-141569e9720f.jpg	The orchid Salad combines Benin aesthetics with Nobelium-based durability	f	5	130	2025-01-16 15:51:12.367+00	2025-01-16 15:51:12.368+00
387	https://picsum.photos/seed/LaMgi/1389/454	62908ad0-d0ea-4b48-9e6f-81612bc05b0e.jpg	Our crispy-inspired Towels brings a taste of luxury to your grave lifestyle	f	6	130	2025-01-16 15:51:12.452+00	2025-01-16 15:51:12.453+00
388	https://loremflickr.com/3947/3381?lock=5166918136735302	675810b6-2a80-47a4-af36-fa3ee8cba753.jpg	The Loren Hat is the latest in a series of early products from Keebler, Marquardt and Morissette	f	2	131	2025-01-16 15:51:12.632+00	2025-01-16 15:51:12.632+00
389	https://loremflickr.com/972/187?lock=5996088757759485	12b87e17-d38f-4e70-93e6-97a283ed0b00.jpg	The olive Chair combines Canada aesthetics with Platinum-based durability	f	7	131	2025-01-16 15:51:12.722+00	2025-01-16 15:51:12.722+00
390	https://picsum.photos/seed/KccKx/888/2025	93f58a45-331f-4b2d-855f-1922ae8c97fd.jpg	Our dolphin-friendly Cheese ensures powerless comfort for your pets	f	7	131	2025-01-16 15:51:12.808+00	2025-01-16 15:51:12.808+00
391	https://picsum.photos/seed/Sd9n6FwbJ/1067/2215	2bb3f5e9-3f74-418d-977b-9a3f33750f4f.jpg	Professional-grade Shirt perfect for posh training and recreational use	f	6	132	2025-01-16 15:51:12.984+00	2025-01-16 15:51:12.984+00
392	https://picsum.photos/seed/21X7zkuk/3515/565	e3727afc-8dd2-4604-a421-591d15fcb459.jpg	Professional-grade Keyboard perfect for rigid training and recreational use	f	10	132	2025-01-16 15:51:13.079+00	2025-01-16 15:51:13.079+00
393	https://loremflickr.com/1940/2094?lock=7949801743101199	ff654598-af17-4616-bfb0-29d26af33cdb.jpg	Our fox-friendly Sausages ensures whole comfort for your pets	f	4	132	2025-01-16 15:51:13.164+00	2025-01-16 15:51:13.164+00
394	https://picsum.photos/seed/TjGmZo/1138/3928	21220f0b-6853-45d4-8d90-0ddabbe9970e.jpg	Ergonomic Mouse made with Plastic for all-day webbed support	f	1	133	2025-01-16 15:51:13.343+00	2025-01-16 15:51:13.343+00
395	https://loremflickr.com/536/3309?lock=3736874180305128	f89b11b5-07eb-4629-9e28-4ecf9ecee67b.jpg	The AI-driven asymmetric product Chair offers reliable performance and happy-go-lucky design	f	8	133	2025-01-16 15:51:13.428+00	2025-01-16 15:51:13.428+00
396	https://picsum.photos/seed/qQqb17TlPf/3732/1670	da31ab13-5738-433e-85f7-ecfee9604231.jpg	Mertz, Koelpin and Gislason's most advanced Table technology increases humiliating capabilities	f	0	133	2025-01-16 15:51:13.529+00	2025-01-16 15:51:13.529+00
397	https://loremflickr.com/376/722?lock=1773520704029741	ad5a60d6-bfcb-4c7b-aa4b-af6fdfbe57c9.jpg	The orange Car combines United Kingdom aesthetics with Polonium-based durability	f	1	134	2025-01-16 15:51:13.707+00	2025-01-16 15:51:13.707+00
398	https://picsum.photos/seed/OSaTrF/2904/1610	0861a152-18d8-4aaa-b247-681528d8dd39.jpg	Gorgeous Keyboard designed with Concrete for shiny performance	f	10	134	2025-01-16 15:51:13.794+00	2025-01-16 15:51:13.795+00
399	https://loremflickr.com/1959/2851?lock=5615847797558132	c04675a0-4051-4387-8634-059e9d538cb0.jpg	Experience the green brilliance of our Chicken, perfect for quick environments	f	2	134	2025-01-16 15:51:13.888+00	2025-01-16 15:51:13.888+00
400	https://picsum.photos/seed/8ShKzA0k/759/628	56d0b282-2b7d-4bb6-8a92-6c65d329320b.jpg	New Keyboard model with 98 GB RAM, 176 GB storage, and boring features	f	6	135	2025-01-16 15:51:14.06+00	2025-01-16 15:51:14.06+00
401	https://picsum.photos/seed/l3gOHpS5r/633/1052	48cacc8a-b07b-4f8a-99b0-ad91dde8d65d.jpg	Our fluffy-inspired Towels brings a taste of luxury to your paltry lifestyle	f	6	135	2025-01-16 15:51:14.158+00	2025-01-16 15:51:14.158+00
402	https://picsum.photos/seed/RSROOwAwbL/2655/282	7ee107eb-761a-4cd2-971d-2a08069ec4f5.jpg	The Customizable impactful microservice Mouse offers reliable performance and shallow design	f	6	135	2025-01-16 15:51:14.249+00	2025-01-16 15:51:14.249+00
403	https://loremflickr.com/1519/3766?lock=4019456173179116	4602c66e-0150-4fe0-aa7d-eee7e711e21a.jpg	New Soap model with 78 GB RAM, 957 GB storage, and lonely features	f	2	136	2025-01-16 15:51:14.424+00	2025-01-16 15:51:14.424+00
404	https://loremflickr.com/1608/3042?lock=3048607663369193	a37e25be-2c3f-4aee-a28d-a207221108ac.jpg	Introducing the Guadeloupe-inspired Pants, blending clear-cut style with local craftsmanship	f	8	136	2025-01-16 15:51:14.51+00	2025-01-16 15:51:14.51+00
405	https://picsum.photos/seed/RpUk0gWv/2554/1147	f4128247-8ad0-4eb1-9f51-c7f950342045.jpg	Introducing the Bosnia and Herzegovina-inspired Fish, blending optimal style with local craftsmanship	f	7	136	2025-01-16 15:51:14.588+00	2025-01-16 15:51:14.588+00
406	https://picsum.photos/seed/rCaF1y4CeE/357/3473	a8d26ef3-39e8-4dd8-86dd-0a6e3772f556.jpg	Discover the puzzled new Chicken with an exciting mix of Wooden ingredients	f	5	137	2025-01-16 15:51:14.758+00	2025-01-16 15:51:14.759+00
407	https://loremflickr.com/3941/3715?lock=5950424572543734	8d2bfa08-3b9a-4d5b-b379-c4d20a09227e.jpg	Innovative Bike featuring raw technology and Plastic construction	f	9	137	2025-01-16 15:51:14.845+00	2025-01-16 15:51:14.845+00
408	https://loremflickr.com/3817/976?lock=8569264590038872	55d93bea-94ba-4b28-a5ea-75be71776eb9.jpg	The Realigned secondary hub Fish offers reliable performance and earnest design	f	3	137	2025-01-16 15:51:14.934+00	2025-01-16 15:51:14.934+00
409	https://loremflickr.com/3401/3423?lock=8720638703557823	e002bcc0-2091-4c85-97ad-a24b0a79ea60.jpg	The Oceane Bike is the latest in a series of intrepid products from Williamson, Koepp and Green	f	2	138	2025-01-16 15:51:15.127+00	2025-01-16 15:51:15.127+00
410	https://picsum.photos/seed/QC3rRAi/150/3781	a9c81e69-9c6b-49c9-abd2-2d5e1be1931c.jpg	Discover the cat-like agility of our Chicken, perfect for deficient users	f	4	138	2025-01-16 15:51:15.209+00	2025-01-16 15:51:15.209+00
411	https://loremflickr.com/1603/182?lock=2334943778901777	9fc0c450-4646-487f-95d1-138e2f1484d2.jpg	Our spicy-inspired Chair brings a taste of luxury to your bogus lifestyle	f	7	138	2025-01-16 15:51:15.298+00	2025-01-16 15:51:15.298+00
412	https://loremflickr.com/3218/60?lock=1750605606041009	46c59fba-b8e6-42e2-8ff6-ff89d2628fa8.jpg	Introducing the Czechia-inspired Towels, blending flimsy style with local craftsmanship	f	10	139	2025-01-16 15:51:15.455+00	2025-01-16 15:51:15.455+00
413	https://picsum.photos/seed/2OyEq8hQO/2102/1809	651f8291-e2c2-4bb1-8a66-abd33c63f3be.jpg	Discover the alive new Table with an exciting mix of Fresh ingredients	f	5	139	2025-01-16 15:51:15.534+00	2025-01-16 15:51:15.534+00
414	https://loremflickr.com/123/1959?lock=2859235755954552	b7ec4707-827f-4d51-85c9-48e449bf9879.jpg	Stylish Ball designed to make you stand out with mad looks	f	5	139	2025-01-16 15:51:15.625+00	2025-01-16 15:51:15.625+00
415	https://loremflickr.com/1045/2475?lock=4396615942518682	316539df-dd9f-4255-9dc6-a26a38903ec5.jpg	Ergonomic Computer made with Plastic for all-day questionable support	f	10	140	2025-01-16 15:51:15.801+00	2025-01-16 15:51:15.801+00
416	https://picsum.photos/seed/cFvIEaQX/3989/171	b7c26939-25b5-4892-ba3f-d44c674a3cef.jpg	Savor the sweet essence in our Pants, designed for back culinary adventures	f	5	140	2025-01-16 15:51:15.89+00	2025-01-16 15:51:15.89+00
417	https://picsum.photos/seed/tnxmyxuYL9/418/774	d13ef4be-caf0-4882-88f9-0b073b78fd2e.jpg	Huel, Larkin and Hyatt's most advanced Gloves technology increases unsteady capabilities	f	8	140	2025-01-16 15:51:15.979+00	2025-01-16 15:51:15.979+00
418	https://picsum.photos/seed/EAoLW9/2746/1141	84fb6e54-d30c-41bd-9913-56c7f622b621.jpg	Professional-grade Pizza perfect for apprehensive training and recreational use	f	5	141	2025-01-16 15:51:16.157+00	2025-01-16 15:51:16.157+00
419	https://picsum.photos/seed/6cTVRq4co/978/3788	2e510a49-6e80-4c86-bf00-b539b07bb814.jpg	Savor the savory essence in our Keyboard, designed for stale culinary adventures	f	5	141	2025-01-16 15:51:16.243+00	2025-01-16 15:51:16.243+00
420	https://loremflickr.com/1024/1985?lock=1216798426922687	bfc96120-87d6-4e7f-8314-58440a67d323.jpg	Introducing the Monaco-inspired Hat, blending profuse style with local craftsmanship	f	7	141	2025-01-16 15:51:16.321+00	2025-01-16 15:51:16.322+00
421	https://loremflickr.com/641/1814?lock=2695112057784894	53e4d7fe-434c-4e04-8521-937ee1ce42f6.jpg	Our bear-friendly Bike ensures pure comfort for your pets	f	10	142	2025-01-16 15:51:16.489+00	2025-01-16 15:51:16.49+00
422	https://loremflickr.com/41/1845?lock=7857939705545921	4b66d951-21a1-4e69-bcfb-6a08d6dd9fc4.jpg	The Persistent real-time software Towels offers reliable performance and every design	f	8	142	2025-01-16 15:51:16.57+00	2025-01-16 15:51:16.57+00
423	https://loremflickr.com/3275/2159?lock=1107989652031832	b763021f-6c7d-4895-9984-4404161ec5a6.jpg	Stylish Cheese designed to make you stand out with nippy looks	f	4	142	2025-01-16 15:51:16.663+00	2025-01-16 15:51:16.663+00
424	https://loremflickr.com/3120/1327?lock=1015373647628846	7f9d766a-6d57-4eb4-8b2f-e892d72fe767.jpg	Savor the fluffy essence in our Bacon, designed for carefree culinary adventures	f	2	143	2025-01-16 15:51:16.844+00	2025-01-16 15:51:16.844+00
425	https://loremflickr.com/1903/2481?lock=8142922557190315	6015df10-66ec-4a6e-ad59-23c02617b3dd.jpg	Experience the salmon brilliance of our Fish, perfect for grubby environments	f	5	143	2025-01-16 15:51:16.923+00	2025-01-16 15:51:16.923+00
426	https://loremflickr.com/2794/1650?lock=2468455333025605	7ba4e592-d8d1-49fc-a437-bb112547c3b5.jpg	New gold Chips with ergonomic design for evil comfort	f	10	143	2025-01-16 15:51:17.014+00	2025-01-16 15:51:17.014+00
427	https://loremflickr.com/3649/426?lock=2197854376567971	d918dae3-64e3-4442-ae5a-b7597708ac16.jpg	Denesik Group's most advanced Pizza technology increases critical capabilities	f	5	144	2025-01-16 15:51:17.188+00	2025-01-16 15:51:17.188+00
428	https://loremflickr.com/2104/103?lock=5180447697906596	9e33f45b-882f-4279-a1ca-4b4b710bf26f.jpg	Discover the penguin-like agility of our Table, perfect for both users	f	7	144	2025-01-16 15:51:17.275+00	2025-01-16 15:51:17.275+00
429	https://loremflickr.com/2091/2502?lock=5031021092601107	94465269-a0db-4686-bd23-a2b6adcf6778.jpg	New green Chicken with ergonomic design for dutiful comfort	f	4	144	2025-01-16 15:51:17.355+00	2025-01-16 15:51:17.355+00
430	https://picsum.photos/seed/o7NEEI/3764/3389	a1afacce-e966-4ae4-a123-60ad2aec03ad.jpg	The Nikko Hat is the latest in a series of acidic products from Ankunding and Sons	f	1	145	2025-01-16 15:51:21.978+00	2025-01-16 15:51:21.978+00
431	https://picsum.photos/seed/vUja7R9/698/3006	77b8a71e-a436-41e7-9856-40696f0fcc8d.jpg	The Sharable needs-based middleware Chicken offers reliable performance and sour design	f	7	145	2025-01-16 15:51:22.071+00	2025-01-16 15:51:22.071+00
432	https://loremflickr.com/1403/28?lock=8261045099018348	178f17e2-16c5-452f-a665-2a84c51b5f3c.jpg	The ivory Pants combines Fiji aesthetics with Flerovium-based durability	f	6	145	2025-01-16 15:51:22.155+00	2025-01-16 15:51:22.155+00
433	https://picsum.photos/seed/DLTYxL/776/3668	dbf76a87-0719-4ac7-a1c2-74d0a5474c9d.jpg	Our bat-friendly Sausages ensures critical comfort for your pets	f	6	146	2025-01-16 15:51:22.342+00	2025-01-16 15:51:22.342+00
434	https://loremflickr.com/3224/1953?lock=8876620154992201	be10281d-83ac-4720-9eae-c2ec8c8d734a.jpg	Featuring Protactinium-enhanced technology, our Computer offers unparalleled quick-witted performance	f	9	146	2025-01-16 15:51:22.426+00	2025-01-16 15:51:22.427+00
435	https://loremflickr.com/3012/2684?lock=7414829666484605	b57d315f-e07d-41b7-a7ed-08d72eaa07ea.jpg	New Pizza model with 27 GB RAM, 548 GB storage, and wordy features	f	9	146	2025-01-16 15:51:22.506+00	2025-01-16 15:51:22.506+00
436	https://loremflickr.com/2760/3211?lock=2297343169252567	e4dd6ac1-c7cc-46dd-934a-2f2c96907e32.jpg	Discover the eagle-like agility of our Table, perfect for steep users	f	6	147	2025-01-16 15:51:22.69+00	2025-01-16 15:51:22.69+00
437	https://picsum.photos/seed/348Qf/177/3290	3ccdcedb-4731-4c18-8f59-bcae0a9e3777.jpg	New Bike model with 33 GB RAM, 754 GB storage, and dark features	f	10	147	2025-01-16 15:51:22.772+00	2025-01-16 15:51:22.772+00
438	https://loremflickr.com/1106/1763?lock=6349649476323415	3a4a44f9-6e64-4eed-931a-e4764f37d821.jpg	Ergonomic Cheese made with Concrete for all-day teeming support	f	7	147	2025-01-16 15:51:22.866+00	2025-01-16 15:51:22.866+00
439	https://loremflickr.com/887/3119?lock=2320661582714055	277651b5-81f9-4f63-9aeb-39fd1c96af08.jpg	Discover the elephant-like agility of our Pants, perfect for legal users	f	1	148	2025-01-16 15:51:23.048+00	2025-01-16 15:51:23.048+00
440	https://picsum.photos/seed/crYI3eP/1145/420	26f29608-10b9-4ce9-8cbb-405c26d59b87.jpg	The Stevie Pizza is the latest in a series of quick products from Strosin - Ernser	f	2	148	2025-01-16 15:51:23.139+00	2025-01-16 15:51:23.139+00
441	https://picsum.photos/seed/k6GyfucfZ/1478/324	0f8e620a-f32a-447d-8b2d-9fa0492993c1.jpg	The sleek and inborn Bacon comes with salmon LED lighting for smart functionality	f	4	148	2025-01-16 15:51:23.225+00	2025-01-16 15:51:23.225+00
442	https://picsum.photos/seed/osJOygq/3530/764	13d4cc63-f07d-4ccd-b1ed-3bd315b0d052.jpg	Our shark-friendly Mouse ensures sad comfort for your pets	f	2	149	2025-01-16 15:51:23.402+00	2025-01-16 15:51:23.402+00
443	https://loremflickr.com/400/962?lock=2413138504016837	9a9d50f8-3cf6-4768-a205-4202506fb47e.jpg	The sleek and untimely Car comes with plum LED lighting for smart functionality	f	1	149	2025-01-16 15:51:23.492+00	2025-01-16 15:51:23.492+00
444	https://loremflickr.com/2684/3242?lock=6423333926861208	21299e77-1357-4104-a716-253a7c3e7b15.jpg	Stylish Sausages designed to make you stand out with awesome looks	f	8	149	2025-01-16 15:51:23.583+00	2025-01-16 15:51:23.583+00
445	https://picsum.photos/seed/Z5DkFM/360/2082	5cc34f2d-52fc-45c5-86f5-405ac8313291.jpg	New Shirt model with 72 GB RAM, 434 GB storage, and severe features	f	9	150	2025-01-16 15:51:23.756+00	2025-01-16 15:51:23.756+00
446	https://picsum.photos/seed/nSDowP/283/2508	88e96c7b-03af-422e-b962-4caf6242818a.jpg	Modern Gloves designed with Cotton for mixed performance	f	7	150	2025-01-16 15:51:23.835+00	2025-01-16 15:51:23.835+00
447	https://loremflickr.com/1954/2864?lock=5101199110024783	db4c54a2-fd6a-4e57-a9a7-a7486911ef75.jpg	Our koala-friendly Towels ensures cumbersome comfort for your pets	f	8	150	2025-01-16 15:51:23.924+00	2025-01-16 15:51:23.924+00
448	https://picsum.photos/seed/ODu6X3Za2R/2004/1571	4f0dc2d2-6551-45ce-88bf-dddfeb26db42.jpg	Introducing the Argentina-inspired Table, blending meaty style with local craftsmanship	f	10	151	2025-01-16 15:51:24.091+00	2025-01-16 15:51:24.091+00
449	https://picsum.photos/seed/XTufR/2976/854	9c7e217e-2cf3-4baa-b02a-9df39bfcf97e.jpg	New tan Bike with ergonomic design for zesty comfort	f	9	151	2025-01-16 15:51:24.17+00	2025-01-16 15:51:24.17+00
450	https://picsum.photos/seed/NqZNGp/2054/302	2f2f47bb-3886-40cf-bb88-6d31bebe8853.jpg	Experience the ivory brilliance of our Mouse, perfect for plump environments	f	4	151	2025-01-16 15:51:24.247+00	2025-01-16 15:51:24.247+00
451	https://picsum.photos/seed/uSTRVQuLq1/2670/2257	8b835466-1851-4b7b-8017-b28440028c91.jpg	Featuring Boron-enhanced technology, our Shirt offers unparalleled terrible performance	f	1	152	2025-01-16 15:51:24.417+00	2025-01-16 15:51:24.417+00
452	https://picsum.photos/seed/ypoLRhCw/1029/1464	d595737c-62ba-4076-90c4-6ca63966d3c2.jpg	Introducing the Montenegro-inspired Soap, blending bare style with local craftsmanship	f	10	152	2025-01-16 15:51:24.51+00	2025-01-16 15:51:24.51+00
453	https://picsum.photos/seed/xz5NKvzxr/2538/439	1c289b80-5a43-4081-ada2-6f0f22df46fd.jpg	Stylish Bike designed to make you stand out with alarmed looks	f	9	152	2025-01-16 15:51:24.598+00	2025-01-16 15:51:24.598+00
454	https://loremflickr.com/121/118?lock=1330510906993986	89f505c2-0266-4870-a2e1-a4e3c1e93f92.jpg	Ergonomic Chips made with Wooden for all-day brilliant support	f	9	153	2025-01-16 15:51:24.77+00	2025-01-16 15:51:24.771+00
455	https://loremflickr.com/2105/1513?lock=3048775938723985	4d4648c5-ce2c-4a0e-92f3-52d0bbde3b3e.jpg	The sleek and unhappy Ball comes with salmon LED lighting for smart functionality	f	9	153	2025-01-16 15:51:24.859+00	2025-01-16 15:51:24.859+00
456	https://picsum.photos/seed/uCO6JnSQq/3666/3388	7e1c9dba-4cdc-479f-aa21-3d93f3cd09cc.jpg	The turquoise Hat combines Tonga aesthetics with Fluorine-based durability	f	3	153	2025-01-16 15:51:24.938+00	2025-01-16 15:51:24.938+00
457	https://loremflickr.com/1594/868?lock=2040800771464196	fa63c16e-cf35-46d9-888e-6e606f01d8ad.jpg	The white Fish combines Croatia aesthetics with Potassium-based durability	f	2	154	2025-01-16 15:51:25.114+00	2025-01-16 15:51:25.114+00
458	https://loremflickr.com/70/3519?lock=2147424403182283	34a4da8c-587d-49ea-8640-bddb65160669.jpg	Discover the cow-like agility of our Shoes, perfect for fine users	f	6	154	2025-01-16 15:51:25.194+00	2025-01-16 15:51:25.194+00
459	https://loremflickr.com/2008/1474?lock=7137739118537431	f498839f-8e45-4466-9ce1-e26151098f51.jpg	The green Shoes combines Cocos (Keeling) Islands aesthetics with Yttrium-based durability	f	4	154	2025-01-16 15:51:25.274+00	2025-01-16 15:51:25.275+00
460	https://picsum.photos/seed/KJVKXa/980/2265	aa58b406-7ac9-48d2-a5e4-302af32226bf.jpg	Featuring Niobium-enhanced technology, our Hat offers unparalleled fixed performance	f	4	155	2025-01-16 15:51:25.449+00	2025-01-16 15:51:25.449+00
461	https://loremflickr.com/149/1409?lock=2884280933839428	1c3ead04-a8f5-402f-bc14-e7dce1dc1487.jpg	The Keanu Hat is the latest in a series of dull products from Langosh Inc	f	5	155	2025-01-16 15:51:25.527+00	2025-01-16 15:51:25.528+00
462	https://picsum.photos/seed/zcdgrpF1H/131/1147	8f039a97-8c36-4982-a1e5-5ba68812ab1e.jpg	Experience the black brilliance of our Tuna, perfect for enchanted environments	f	2	155	2025-01-16 15:51:25.607+00	2025-01-16 15:51:25.607+00
463	https://picsum.photos/seed/umopYd/2765/971	dd54d34f-7e48-4e20-9914-5e306e1e4602.jpg	Experience the lavender brilliance of our Bacon, perfect for intrepid environments	f	8	156	2025-01-16 15:51:25.787+00	2025-01-16 15:51:25.787+00
464	https://picsum.photos/seed/8jdcpY/3455/3893	4fdb81a3-7c99-4289-a868-efe2aaf48be6.jpg	Oriental Fish designed with Plastic for advanced performance	f	1	156	2025-01-16 15:51:25.874+00	2025-01-16 15:51:25.874+00
465	https://loremflickr.com/2441/1708?lock=8408535102523493	fdbbbff9-9d4f-43a7-a6f6-e76217ab7c19.jpg	Discover the tight new Salad with an exciting mix of Wooden ingredients	f	8	156	2025-01-16 15:51:25.962+00	2025-01-16 15:51:25.962+00
466	https://picsum.photos/seed/YZ9cBpoMIl/2245/1270	8412b613-7b05-4676-b593-7f1b36bdd383.jpg	New teal Mouse with ergonomic design for unfinished comfort	f	6	157	2025-01-16 15:51:29.32+00	2025-01-16 15:51:29.32+00
467	https://picsum.photos/seed/ted9fYS/2732/2417	241e60e1-d8db-47ef-9499-4d9ccadff272.jpg	Introducing the Tunisia-inspired Chips, blending scratchy style with local craftsmanship	f	9	157	2025-01-16 15:51:29.408+00	2025-01-16 15:51:29.408+00
468	https://loremflickr.com/1250/2925?lock=675041700986024	61b75138-f82b-4b1b-a888-3f307f1ab5eb.jpg	Discover the penguin-like agility of our Shoes, perfect for lasting users	f	0	157	2025-01-16 15:51:29.486+00	2025-01-16 15:51:29.486+00
469	https://picsum.photos/seed/NlaiW/1447/1140	026dd9e3-cdca-4cfe-81ed-10c21985f772.jpg	Experience the yellow brilliance of our Computer, perfect for icy environments	f	4	158	2025-01-16 15:51:29.644+00	2025-01-16 15:51:29.644+00
470	https://loremflickr.com/2901/1842?lock=78312514793836	2c6989cf-45a1-49ed-aa2b-20408065ed1a.jpg	Featuring Platinum-enhanced technology, our Towels offers unparalleled inferior performance	f	3	158	2025-01-16 15:51:29.733+00	2025-01-16 15:51:29.733+00
471	https://picsum.photos/seed/cTV7GbcX/362/1140	1ae525be-c456-42e6-9727-b428330224c8.jpg	Our bitter-inspired Pants brings a taste of luxury to your french lifestyle	f	2	158	2025-01-16 15:51:29.826+00	2025-01-16 15:51:29.826+00
472	https://picsum.photos/seed/wn94v/640/1385	ab46c20c-2e3b-465b-bf3b-82bc4e642101.jpg	Featuring Darmstadtium-enhanced technology, our Chair offers unparalleled soft performance	f	10	159	2025-01-16 15:51:30.012+00	2025-01-16 15:51:30.012+00
473	https://loremflickr.com/3065/2932?lock=9943227245774	fca69aff-a7ff-4e3b-872a-c19db5b2f6a8.jpg	New Pizza model with 53 GB RAM, 447 GB storage, and wise features	f	3	159	2025-01-16 15:51:30.096+00	2025-01-16 15:51:30.097+00
474	https://picsum.photos/seed/GBF3DGf67/217/3501	d9ff169f-c509-42cd-bbca-07dd8d951408.jpg	The Immersive hybrid toolset Shirt offers reliable performance and reasonable design	f	7	159	2025-01-16 15:51:30.187+00	2025-01-16 15:51:30.187+00
475	https://loremflickr.com/1554/1549?lock=8002552904649046	9707f4bb-59d3-4197-8929-b212eac1ba59.jpg	Our fluffy-inspired Table brings a taste of luxury to your brilliant lifestyle	f	2	160	2025-01-16 15:51:30.363+00	2025-01-16 15:51:30.363+00
476	https://picsum.photos/seed/pAxJkdXla3/3164/2838	b704023f-a0ff-4653-af46-4a373604ca41.jpg	Savor the savory essence in our Pizza, designed for angelic culinary adventures	f	8	160	2025-01-16 15:51:30.452+00	2025-01-16 15:51:30.452+00
477	https://picsum.photos/seed/Fs6vVkV4/3563/100	653b8d00-6f55-49de-94de-bd50e77232be.jpg	The red Tuna combines Brunei Darussalam aesthetics with Copernicium-based durability	f	2	160	2025-01-16 15:51:30.53+00	2025-01-16 15:51:30.53+00
478	https://picsum.photos/seed/zy1Ti/2103/2683	66c1c178-1576-4df6-9453-5c2ecbaceedc.jpg	New Bike model with 25 GB RAM, 900 GB storage, and official features	f	10	161	2025-01-16 15:51:30.698+00	2025-01-16 15:51:30.698+00
479	https://picsum.photos/seed/f8IVcCJqn/3214/2352	de9053a8-522c-42a7-b1b1-3b72f244c3a4.jpg	Experience the grey brilliance of our Chips, perfect for extroverted environments	f	5	161	2025-01-16 15:51:30.803+00	2025-01-16 15:51:30.803+00
480	https://picsum.photos/seed/JXR3D/68/3548	b2f5895f-8515-4b14-a827-57464a45615e.jpg	Savor the juicy essence in our Chips, designed for shy culinary adventures	f	5	161	2025-01-16 15:51:30.884+00	2025-01-16 15:51:30.884+00
481	https://loremflickr.com/2434/2555?lock=2210188147354480	4240bd43-8273-4b3f-94c4-39a2e04b7a8a.jpg	New turquoise Bacon with ergonomic design for fluffy comfort	f	1	162	2025-01-16 15:51:31.041+00	2025-01-16 15:51:31.041+00
482	https://picsum.photos/seed/PDfGGdXj/170/1425	822a9c14-576f-4472-b665-645770d05ab2.jpg	Ergonomic Sausages made with Soft for all-day raw support	f	9	162	2025-01-16 15:51:31.121+00	2025-01-16 15:51:31.122+00
483	https://picsum.photos/seed/X7DOa/2239/1742	1c51d079-cff4-4e03-892e-d6c25cdc378b.jpg	Zieme - Ernser's most advanced Car technology increases well-lit capabilities	f	9	162	2025-01-16 15:51:31.198+00	2025-01-16 15:51:31.199+00
484	https://picsum.photos/seed/rEPL1QKs/1930/663	4e8f0691-6890-4083-84c2-3bf7dee94cce.jpg	Savor the fresh essence in our Mouse, designed for inferior culinary adventures	f	10	163	2025-01-16 15:51:31.359+00	2025-01-16 15:51:31.359+00
485	https://picsum.photos/seed/iyL8jem/46/774	ae1fffb2-3923-4bb3-abde-30300d24ce19.jpg	Professional-grade Tuna perfect for flashy training and recreational use	f	5	163	2025-01-16 15:51:31.489+00	2025-01-16 15:51:31.489+00
486	https://picsum.photos/seed/024S79Z9zw/2200/1961	a5b722b9-d766-4620-8998-a01b290ecc5b.jpg	Schmeler and Sons's most advanced Ball technology increases low capabilities	f	0	163	2025-01-16 15:51:31.573+00	2025-01-16 15:51:31.573+00
487	https://picsum.photos/seed/jtf2xQDrSM/3255/323	432ce98f-31f1-4d10-8593-19522f4ead3d.jpg	Introducing the Antarctica-inspired Car, blending dual style with local craftsmanship	f	4	164	2025-01-16 15:51:31.752+00	2025-01-16 15:51:31.752+00
488	https://loremflickr.com/104/399?lock=1687354673556942	f18c4dd6-4f4f-4060-a6aa-df3b1be69df7.jpg	Featuring Astatine-enhanced technology, our Towels offers unparalleled regular performance	f	4	164	2025-01-16 15:51:31.84+00	2025-01-16 15:51:31.84+00
489	https://picsum.photos/seed/SmvV6LmXc/2641/3586	590e4264-ecfe-46f8-bcdb-1ed89e7826fd.jpg	Savor the salty essence in our Computer, designed for french culinary adventures	f	1	164	2025-01-16 15:51:31.918+00	2025-01-16 15:51:31.918+00
490	https://loremflickr.com/3737/3862?lock=3505912622514347	482fea7f-8417-4b6b-8b7d-9a296e064821.jpg	The Reverse-engineered system-worthy leverage Car offers reliable performance and unique design	f	8	165	2025-01-16 15:51:32.077+00	2025-01-16 15:51:32.077+00
491	https://picsum.photos/seed/gdrynwS6Vh/3213/1575	b4485151-fff3-4dba-93d0-65fa278c919c.jpg	Goyette LLC's most advanced Ball technology increases triangular capabilities	f	4	165	2025-01-16 15:51:32.17+00	2025-01-16 15:51:32.17+00
492	https://loremflickr.com/3250/1762?lock=8557930635567186	88a087ae-a73c-4257-9071-bc5dc082ee92.jpg	New Bike model with 61 GB RAM, 436 GB storage, and dismal features	f	2	165	2025-01-16 15:51:32.254+00	2025-01-16 15:51:32.254+00
493	https://picsum.photos/seed/bsKRG/783/1182	24feb7a0-fe72-4192-97f2-ae5dbf0de937.jpg	Gerlach - Trantow's most advanced Mouse technology increases whirlwind capabilities	f	1	166	2025-01-16 15:51:32.421+00	2025-01-16 15:51:32.421+00
494	https://picsum.photos/seed/KCTAl1Um/3906/185	56ddc857-77bb-4e72-a026-075e5fb3a07a.jpg	Ergonomic Salad made with Rubber for all-day unwieldy support	f	4	166	2025-01-16 15:51:32.502+00	2025-01-16 15:51:32.502+00
495	https://picsum.photos/seed/fu5uYNYXl/228/824	99c27ca5-0a1a-4af8-b39e-7664de25da7d.jpg	Vandervort LLC's most advanced Gloves technology increases clear-cut capabilities	f	2	166	2025-01-16 15:51:32.588+00	2025-01-16 15:51:32.588+00
496	https://picsum.photos/seed/OukHd/1797/2328	3f84c425-e0f5-4054-88e1-5cc98c44a79a.jpg	New yellow Soap with ergonomic design for impossible comfort	f	10	167	2025-01-16 15:51:32.769+00	2025-01-16 15:51:32.769+00
497	https://loremflickr.com/583/105?lock=2224448396257244	34d5bec9-a5eb-4cd1-95c4-033e375af6ca.jpg	Featuring Silver-enhanced technology, our Pizza offers unparalleled winding performance	f	9	167	2025-01-16 15:51:32.859+00	2025-01-16 15:51:32.859+00
498	https://picsum.photos/seed/NVfJuAi4Y/3566/1918	88eb626c-6815-4f7b-bca7-0ef1484445d3.jpg	Savor the salty essence in our Keyboard, designed for rectangular culinary adventures	f	2	167	2025-01-16 15:51:32.945+00	2025-01-16 15:51:32.945+00
499	https://picsum.photos/seed/WMlTpBHc/550/643	32184199-1063-4c0c-9bff-fb3efa285cd4.jpg	Discover the hamster-like agility of our Table, perfect for wonderful users	f	10	168	2025-01-16 15:51:36.006+00	2025-01-16 15:51:36.006+00
500	https://loremflickr.com/3562/136?lock=56434533382351	3599f40e-045e-4ef0-83a0-3294848c4d07.jpg	Savor the moist essence in our Cheese, designed for exalted culinary adventures	f	0	168	2025-01-16 15:51:36.094+00	2025-01-16 15:51:36.094+00
501	https://loremflickr.com/901/772?lock=4915719422925187	262852c9-7f93-4936-8592-185cebb1bfaa.jpg	Savor the moist essence in our Shoes, designed for little culinary adventures	f	10	168	2025-01-16 15:51:36.172+00	2025-01-16 15:51:36.172+00
502	https://picsum.photos/seed/e0eGuxPjg/1661/1972	74265150-a8a1-46f8-a78c-87c75855e605.jpg	Ergonomic Chips made with Rubber for all-day dental support	f	5	169	2025-01-16 15:51:36.329+00	2025-01-16 15:51:36.329+00
503	https://loremflickr.com/1183/3950?lock=4979494541884111	47636eec-d3b3-45d9-ba3b-ebdd0ae42915.jpg	Marks, Stoltenberg and Yundt's most advanced Cheese technology increases sarcastic capabilities	f	7	169	2025-01-16 15:51:36.407+00	2025-01-16 15:51:36.407+00
504	https://loremflickr.com/2661/1778?lock=7639230345813999	4a82590d-c08a-4cab-a6df-16ace91a695e.jpg	Our juicy-inspired Sausages brings a taste of luxury to your drab lifestyle	f	8	169	2025-01-16 15:51:36.486+00	2025-01-16 15:51:36.486+00
505	https://loremflickr.com/3949/2646?lock=2966673347773930	fc5475f9-b3d3-4790-bfa9-7c8bbd69c1e4.jpg	The Pierre Shoes is the latest in a series of bright products from Green, Hansen and Harber	f	0	170	2025-01-16 15:51:36.655+00	2025-01-16 15:51:36.655+00
506	https://loremflickr.com/1295/3890?lock=7934160773407421	6c87253e-0e1a-453b-bb2b-2adab03729ba.jpg	Experience the blue brilliance of our Chips, perfect for agreeable environments	f	7	170	2025-01-16 15:51:36.749+00	2025-01-16 15:51:36.749+00
507	https://loremflickr.com/684/1693?lock=7474157579976673	c6f135c0-0be1-42cb-a090-346a92f562ef.jpg	Professional-grade Bacon perfect for ironclad training and recreational use	f	7	170	2025-01-16 15:51:36.839+00	2025-01-16 15:51:36.839+00
508	https://loremflickr.com/59/3474?lock=7845374543995378	46bd281d-9d48-4b87-9217-f159c6f8e445.jpg	The sleek and far-flung Computer comes with pink LED lighting for smart functionality	f	3	171	2025-01-16 15:51:37.016+00	2025-01-16 15:51:37.016+00
509	https://loremflickr.com/1813/2917?lock=1421585363861471	f5ae3a71-7c93-4eac-b121-ed9f16b8e5fe.jpg	Our delicious-inspired Shirt brings a taste of luxury to your insistent lifestyle	f	2	171	2025-01-16 15:51:37.099+00	2025-01-16 15:51:37.1+00
510	https://loremflickr.com/2538/114?lock=8306291924904099	9849cd7f-5652-4952-83ea-1f827cc0cb88.jpg	Our rhinoceros-friendly Fish ensures shrill comfort for your pets	f	7	171	2025-01-16 15:51:37.187+00	2025-01-16 15:51:37.187+00
511	https://picsum.photos/seed/dEV3d/3038/3170	df3f1a8d-c004-4e5b-beb1-4c606a73cfe7.jpg	Innovative Shoes featuring unpleasant technology and Soft construction	f	1	172	2025-01-16 15:51:37.356+00	2025-01-16 15:51:37.356+00
512	https://picsum.photos/seed/jNAjziy6J/3831/1426	8cd597dc-9235-4e1b-9e9c-00651284bcdb.jpg	Stylish Towels designed to make you stand out with good looks	f	2	172	2025-01-16 15:51:37.444+00	2025-01-16 15:51:37.444+00
513	https://picsum.photos/seed/7v8chb1/1975/2998	5744096b-5b26-4a19-b403-d9aabb113b72.jpg	The sleek and descriptive Chips comes with purple LED lighting for smart functionality	f	1	172	2025-01-16 15:51:37.536+00	2025-01-16 15:51:37.536+00
514	https://picsum.photos/seed/IIaYn/1957/2615	162983de-f94d-4302-b210-4b88c3d583d6.jpg	Ergonomic Pants made with Fresh for all-day inexperienced support	f	9	173	2025-01-16 15:51:37.703+00	2025-01-16 15:51:37.703+00
515	https://picsum.photos/seed/VpVyVw4w/853/309	356e67a7-b75a-4415-a345-e240340b639b.jpg	The blue Bacon combines Ukraine aesthetics with Iodine-based durability	f	1	173	2025-01-16 15:51:37.786+00	2025-01-16 15:51:37.787+00
516	https://picsum.photos/seed/e0kMRR8bi/2845/970	48f7c688-af89-4d88-a281-75166dc4cf3c.jpg	New olive Pizza with ergonomic design for blank comfort	f	1	173	2025-01-16 15:51:37.865+00	2025-01-16 15:51:37.865+00
517	https://picsum.photos/seed/hjk8YR/1923/1126	c8f91e86-2cb5-4a50-b018-5be15addbeda.jpg	Savor the sour essence in our Ball, designed for delicious culinary adventures	f	0	174	2025-01-16 15:51:38.024+00	2025-01-16 15:51:38.024+00
518	https://picsum.photos/seed/ynyYlr1nNf/858/1970	4cbf66dd-ba91-4039-9a44-9886097ba730.jpg	Ergonomic Cheese designed with Metal for strange performance	f	7	174	2025-01-16 15:51:38.113+00	2025-01-16 15:51:38.113+00
519	https://loremflickr.com/1694/3952?lock=7386924926500739	b2c4d7fa-7f46-4dd7-a3fe-9b929db2407f.jpg	Awesome Ball designed with Bronze for gripping performance	f	5	174	2025-01-16 15:51:38.203+00	2025-01-16 15:51:38.203+00
520	https://picsum.photos/seed/fdPQVk/2301/1091	387dabe6-c1f0-4d54-900c-0844bcc804a4.jpg	New indigo Shirt with ergonomic design for shiny comfort	f	6	175	2025-01-16 15:51:38.378+00	2025-01-16 15:51:38.378+00
521	https://loremflickr.com/1558/3438?lock=4401881972476021	289a509c-d87a-43b1-bae8-bd449ca9e934.jpg	The Reverse-engineered holistic generative AI Ball offers reliable performance and showy design	f	4	175	2025-01-16 15:51:38.456+00	2025-01-16 15:51:38.456+00
522	https://picsum.photos/seed/w19bjgfrsB/2989/646	ab35cadf-e288-4bf5-b2f0-2ee8cc9f021c.jpg	Discover the petty new Fish with an exciting mix of Wooden ingredients	f	8	175	2025-01-16 15:51:38.535+00	2025-01-16 15:51:38.535+00
523	https://picsum.photos/seed/OX6AQtQ0o/1177/1300	8607d24d-3ca7-4ee5-a32f-315311dd6ad1.jpg	Featuring Hydrogen-enhanced technology, our Soap offers unparalleled scratchy performance	f	5	176	2025-01-16 15:51:38.714+00	2025-01-16 15:51:38.714+00
524	https://loremflickr.com/2774/151?lock=2533843005102213	a2c96c4b-a14d-46e4-8f29-922974ddc056.jpg	Introducing the Palestine-inspired Keyboard, blending unwilling style with local craftsmanship	f	2	176	2025-01-16 15:51:38.811+00	2025-01-16 15:51:38.812+00
525	https://picsum.photos/seed/JUzrb9dEd/969/226	7c2da018-b021-4503-8ece-3370579311a1.jpg	Professional-grade Tuna perfect for blaring training and recreational use	f	10	176	2025-01-16 15:51:38.899+00	2025-01-16 15:51:38.899+00
526	https://loremflickr.com/2149/914?lock=1738088926997610	6032953d-77fd-4462-9d70-3d9e85dc333b.jpg	The Triple-buffered reciprocal knowledge base Fish offers reliable performance and lean design	f	3	177	2025-01-16 15:51:41.44+00	2025-01-16 15:51:41.44+00
527	https://picsum.photos/seed/rqQOOjP8/1752/1125	7da8ea9a-1d5c-431c-b2ba-d59aec24b3a8.jpg	Innovative Salad featuring vague technology and Rubber construction	f	10	177	2025-01-16 15:51:41.519+00	2025-01-16 15:51:41.519+00
528	https://loremflickr.com/2023/1133?lock=112199312991085	1af2c633-68b4-4476-aafb-b612b4257296.jpg	New Shirt model with 47 GB RAM, 88 GB storage, and exhausted features	f	8	177	2025-01-16 15:51:41.607+00	2025-01-16 15:51:41.607+00
529	https://picsum.photos/seed/oBj5gmnaE/3875/736	5332f936-dc5e-4cf9-a7e1-0f96b1e8f153.jpg	Innovative Tuna featuring zealous technology and Soft construction	f	1	178	2025-01-16 15:51:41.785+00	2025-01-16 15:51:41.785+00
530	https://picsum.photos/seed/cHmEgCISTy/283/751	3210f388-fef6-499a-93fd-f8063f97f659.jpg	Our butterfly-friendly Towels ensures trusty comfort for your pets	f	2	178	2025-01-16 15:51:41.875+00	2025-01-16 15:51:41.875+00
531	https://loremflickr.com/2225/390?lock=1452507741845099	fb93bc00-e1c4-4b41-b82e-386f5551fa4b.jpg	Featuring Copernicium-enhanced technology, our Fish offers unparalleled dark performance	f	9	178	2025-01-16 15:51:41.971+00	2025-01-16 15:51:41.971+00
532	https://picsum.photos/seed/alqSK/2195/2811	5ed6973e-9df8-4493-a234-2f7236e2ab9c.jpg	Featuring Scandium-enhanced technology, our Pizza offers unparalleled muddy performance	f	9	179	2025-01-16 15:51:42.15+00	2025-01-16 15:51:42.151+00
533	https://loremflickr.com/3834/3837?lock=6507463143130334	e2807c6a-c19f-409c-9ab9-89550e3ccc65.jpg	Savor the golden essence in our Shirt, designed for mean culinary adventures	f	6	179	2025-01-16 15:51:42.242+00	2025-01-16 15:51:42.242+00
534	https://loremflickr.com/2894/949?lock=4477371056971887	a955b9b8-fbd9-4950-ab79-cb54161e0816.jpg	Our frog-friendly Shirt ensures flickering comfort for your pets	f	8	179	2025-01-16 15:51:42.328+00	2025-01-16 15:51:42.328+00
535	https://loremflickr.com/231/1745?lock=8642352196928387	efcd26a5-336d-45ea-9ef3-ab2b411e33fe.jpg	Our zesty-inspired Table brings a taste of luxury to your substantial lifestyle	f	6	180	2025-01-16 15:51:42.504+00	2025-01-16 15:51:42.505+00
536	https://loremflickr.com/2571/2281?lock=3724432336818749	379392a5-e834-499c-9a3f-547946a83379.jpg	Experience the azure brilliance of our Ball, perfect for lonely environments	f	5	180	2025-01-16 15:51:42.592+00	2025-01-16 15:51:42.592+00
537	https://picsum.photos/seed/lf6fG4/1363/3261	4deb9a20-805f-4e7d-9f54-a70a5ae119d8.jpg	The sleek and oval Salad comes with blue LED lighting for smart functionality	f	4	180	2025-01-16 15:51:42.675+00	2025-01-16 15:51:42.675+00
538	https://loremflickr.com/3811/2659?lock=6380373883500917	fb1270e2-9d0a-4071-a732-1927a10419b0.jpg	Featuring Potassium-enhanced technology, our Chicken offers unparalleled prudent performance	f	7	181	2025-01-16 15:51:42.856+00	2025-01-16 15:51:42.856+00
539	https://loremflickr.com/1749/2409?lock=2194412411963678	e60eed4b-9f70-43c9-9c73-a899fa4098d1.jpg	The Trevor Keyboard is the latest in a series of talkative products from Anderson, Kohler and Turner	f	7	181	2025-01-16 15:51:42.94+00	2025-01-16 15:51:42.941+00
540	https://loremflickr.com/1092/15?lock=4918960364014135	8df8fb50-6770-4580-85f8-3ffac2f057e1.jpg	Professional-grade Cheese perfect for taut training and recreational use	f	10	181	2025-01-16 15:51:43.026+00	2025-01-16 15:51:43.026+00
541	https://picsum.photos/seed/Ul39aZF/1646/3195	f3426d33-7c70-46be-8e43-fc60fa6b5081.jpg	The sleek and distant Chicken comes with lime LED lighting for smart functionality	f	9	182	2025-01-16 15:51:45.077+00	2025-01-16 15:51:45.078+00
542	https://picsum.photos/seed/mtc1bM5JM/1138/3364	18b0f50a-6e69-4429-9f7e-bf2d22cc638a.jpg	Our golden-inspired Table brings a taste of luxury to your querulous lifestyle	f	5	182	2025-01-16 15:51:45.164+00	2025-01-16 15:51:45.164+00
543	https://loremflickr.com/543/1854?lock=1758342099677467	86dd60d0-eeef-4363-8f3e-bfc95adf0524.jpg	New Keyboard model with 19 GB RAM, 437 GB storage, and elegant features	f	8	182	2025-01-16 15:51:45.252+00	2025-01-16 15:51:45.252+00
544	https://picsum.photos/seed/usKXp/467/3538	0cbfe4fe-715d-40dc-bb8c-0fbdec6e6006.jpg	Our sour-inspired Chicken brings a taste of luxury to your enraged lifestyle	f	3	183	2025-01-16 15:51:45.419+00	2025-01-16 15:51:45.42+00
545	https://loremflickr.com/2072/3195?lock=5036041367256886	72c94085-ac20-49c6-96b9-71a5b31bdccc.jpg	Discover the expensive new Bacon with an exciting mix of Fresh ingredients	f	0	183	2025-01-16 15:51:45.506+00	2025-01-16 15:51:45.506+00
546	https://picsum.photos/seed/IdWA0/142/3196	5bb2e7ad-6149-4287-b073-7b6aadbe09ff.jpg	Introducing the Estonia-inspired Shoes, blending impure style with local craftsmanship	f	0	183	2025-01-16 15:51:45.585+00	2025-01-16 15:51:45.585+00
547	https://picsum.photos/seed/3i4PzQ/3455/2198	03628fe7-94cf-40b0-87dd-d145f0dcb873.jpg	Featuring Gadolinium-enhanced technology, our Table offers unparalleled unfinished performance	f	4	184	2025-01-16 15:51:45.753+00	2025-01-16 15:51:45.753+00
548	https://picsum.photos/seed/letKxPMsg/954/1549	824cdeac-f6ea-409d-a92f-d90a36598c04.jpg	Stylish Chips designed to make you stand out with sinful looks	f	4	184	2025-01-16 15:51:45.846+00	2025-01-16 15:51:45.846+00
549	https://loremflickr.com/3862/2598?lock=6804888256296114	f4b121f9-f689-4744-bba7-23a84802ef85.jpg	The Operative scalable knowledge base Tuna offers reliable performance and extroverted design	f	6	184	2025-01-16 15:51:45.957+00	2025-01-16 15:51:45.957+00
550	https://picsum.photos/seed/rw5Qk8b/3586/2529	23eb26cb-8eef-4d82-bd92-1f30d38eee18.jpg	Our bitter-inspired Tuna brings a taste of luxury to your corrupt lifestyle	f	3	185	2025-01-16 15:51:46.13+00	2025-01-16 15:51:46.131+00
551	https://loremflickr.com/3656/1947?lock=1002541564620144	846e7592-def0-4366-a746-ea0fc02689a7.jpg	New grey Mouse with ergonomic design for mixed comfort	f	1	185	2025-01-16 15:51:46.22+00	2025-01-16 15:51:46.22+00
552	https://loremflickr.com/79/1763?lock=7399762072568369	f7def65a-2a41-4abe-9fd2-c2d681cdf463.jpg	Savor the spicy essence in our Computer, designed for genuine culinary adventures	f	10	185	2025-01-16 15:51:46.311+00	2025-01-16 15:51:46.311+00
553	https://loremflickr.com/1943/1270?lock=6653826352253319	1497d421-130c-4d71-b2b0-76f98c7ac603.jpg	Keebler - Cremin's most advanced Gloves technology increases profitable capabilities	f	10	186	2025-01-16 15:51:46.481+00	2025-01-16 15:51:46.481+00
554	https://loremflickr.com/3283/3307?lock=3923048669179619	de15d5c3-0b75-49be-96ea-cd3635caab03.jpg	Sleek Chicken designed with Bronze for educated performance	f	10	186	2025-01-16 15:51:46.568+00	2025-01-16 15:51:46.57+00
555	https://picsum.photos/seed/SXUnh/170/3215	dd9e90c5-33d8-462c-8adc-9584a468cbc1.jpg	New orchid Tuna with ergonomic design for decisive comfort	f	3	186	2025-01-16 15:51:46.66+00	2025-01-16 15:51:46.66+00
556	https://picsum.photos/seed/MeBytX/3361/3795	7dbb3682-8684-4748-b822-a0c2c12841a1.jpg	The Helene Salad is the latest in a series of bruised products from Ratke, Boyle and Kulas	f	1	187	2025-01-16 15:51:46.846+00	2025-01-16 15:51:46.846+00
557	https://picsum.photos/seed/TIJKAHcU/651/1486	f88b7101-0e91-4e1f-ae43-7c7d0a964885.jpg	Ergonomic Cheese made with Rubber for all-day turbulent support	f	3	187	2025-01-16 15:51:46.945+00	2025-01-16 15:51:46.945+00
558	https://picsum.photos/seed/tJreBp/639/97	de7fbcf4-0a52-4516-9751-31bd5070746d.jpg	Featuring Neptunium-enhanced technology, our Fish offers unparalleled remorseful performance	f	7	187	2025-01-16 15:51:47.04+00	2025-01-16 15:51:47.04+00
559	https://picsum.photos/seed/ka8HO/947/1145	9796a946-16ba-49ae-802e-ac28698e5111.jpg	Purdy LLC's most advanced Pizza technology increases rich capabilities	f	3	188	2025-01-16 15:51:47.225+00	2025-01-16 15:51:47.225+00
560	https://picsum.photos/seed/dSlNb5T5/150/119	57550ec4-9855-498d-abd1-295f46b942f2.jpg	Innovative Mouse featuring messy technology and Wooden construction	f	4	188	2025-01-16 15:51:47.314+00	2025-01-16 15:51:47.314+00
561	https://picsum.photos/seed/VzaKlQVpQb/867/1941	f244db17-1913-4c43-93d5-d314030e166a.jpg	Elegant Hat designed with Rubber for frequent performance	f	5	188	2025-01-16 15:51:47.41+00	2025-01-16 15:51:47.41+00
562	https://picsum.photos/seed/pVR2dyVVX/462/3896	fd8648bb-09eb-4989-a114-93a16e749938.jpg	Professional-grade Bacon perfect for lanky training and recreational use	f	9	189	2025-01-16 15:51:47.594+00	2025-01-16 15:51:47.594+00
563	https://loremflickr.com/3664/573?lock=5945597474961348	9b913a9e-c80b-4330-aafe-7168ffe0563f.jpg	Savor the sour essence in our Car, designed for glittering culinary adventures	f	0	189	2025-01-16 15:51:47.684+00	2025-01-16 15:51:47.685+00
564	https://picsum.photos/seed/c2RQ9Ogkat/1948/873	61d3b475-e857-4891-8110-28d7fe162813.jpg	Our savory-inspired Cheese brings a taste of luxury to your flashy lifestyle	f	1	189	2025-01-16 15:51:47.776+00	2025-01-16 15:51:47.776+00
565	https://picsum.photos/seed/8JdZt6m/2894/2513	160aaf8e-690b-4e5e-b7c9-050dd608e396.jpg	New pink Table with ergonomic design for considerate comfort	f	8	190	2025-01-16 15:51:47.963+00	2025-01-16 15:51:47.963+00
566	https://picsum.photos/seed/B96L5/2322/2434	d50f6d69-64f9-4aa8-9701-b15798ff3f68.jpg	The sleek and strong Table comes with maroon LED lighting for smart functionality	f	7	190	2025-01-16 15:51:48.069+00	2025-01-16 15:51:48.069+00
567	https://picsum.photos/seed/vMNWfz97Z/2209/1675	ac64d833-6245-4947-a834-6ef300ff1910.jpg	Our fox-friendly Chair ensures calculating comfort for your pets	f	9	190	2025-01-16 15:51:48.161+00	2025-01-16 15:51:48.161+00
568	https://loremflickr.com/964/3692?lock=7423001971075054	d69071c6-550a-49d0-a6f3-44f1b333c5c7.jpg	Wyman, Monahan and Schowalter's most advanced Shirt technology increases right capabilities	f	9	191	2025-01-16 15:51:48.331+00	2025-01-16 15:51:48.331+00
569	https://picsum.photos/seed/9kfNf/264/3147	ed9efebb-e48f-4000-b9ab-a604d36b550a.jpg	Our crunchy-inspired Ball brings a taste of luxury to your clueless lifestyle	f	3	191	2025-01-16 15:51:48.425+00	2025-01-16 15:51:48.425+00
570	https://picsum.photos/seed/gyhW00J/3125/2388	1a3f3e56-fd89-4c85-a7e5-47450a0dd232.jpg	The Ergonomic mission-critical concept Tuna offers reliable performance and honored design	f	9	191	2025-01-16 15:51:48.512+00	2025-01-16 15:51:48.513+00
571	https://picsum.photos/seed/rC4cZ7/982/1202	bb43b8ab-fdb2-44b7-a360-317d62184c3e.jpg	Our fresh-inspired Tuna brings a taste of luxury to your monstrous lifestyle	f	10	192	2025-01-16 15:51:51.354+00	2025-01-16 15:51:51.354+00
572	https://picsum.photos/seed/UY81w/209/138	4a471837-f08e-4070-a94e-7cf9184d6148.jpg	New silver Bacon with ergonomic design for impressionable comfort	f	7	192	2025-01-16 15:51:51.433+00	2025-01-16 15:51:51.433+00
573	https://picsum.photos/seed/5cGZIk8/50/3047	1e9b4a46-101f-48f5-84fc-7fd3a544d147.jpg	Our salty-inspired Shirt brings a taste of luxury to your waterlogged lifestyle	f	9	192	2025-01-16 15:51:51.511+00	2025-01-16 15:51:51.512+00
574	https://loremflickr.com/2702/3892?lock=2716480941636887	4bb12e46-386b-4f96-9954-86680d5378f3.jpg	The mint green Hat combines Mali aesthetics with Manganese-based durability	f	4	193	2025-01-16 15:51:51.69+00	2025-01-16 15:51:51.691+00
575	https://picsum.photos/seed/mKO5V/158/998	4f342bba-4ff3-45f7-ab89-f098a2c27edf.jpg	New cyan Computer with ergonomic design for immaculate comfort	f	3	193	2025-01-16 15:51:51.778+00	2025-01-16 15:51:51.779+00
576	https://loremflickr.com/2911/2717?lock=4434192298835634	e40c2477-2962-4427-8152-9360c1bc5878.jpg	New Sausages model with 45 GB RAM, 321 GB storage, and impish features	f	6	193	2025-01-16 15:51:51.874+00	2025-01-16 15:51:51.874+00
577	https://picsum.photos/seed/Zcksl/1876/74	a1883215-d1cd-4410-963d-f70078313c7e.jpg	Schaefer - Farrell's most advanced Chips technology increases carefree capabilities	f	6	194	2025-01-16 15:51:52.046+00	2025-01-16 15:51:52.046+00
578	https://picsum.photos/seed/prmEA4N3P/3406/1544	8d934f89-48bf-4395-9cc3-9b16cdf934d2.jpg	Konopelski, Monahan and Fisher's most advanced Car technology increases cloudy capabilities	f	9	194	2025-01-16 15:51:52.134+00	2025-01-16 15:51:52.134+00
579	https://loremflickr.com/3432/3094?lock=8438111415402052	c1d26c04-3aaf-4a6d-add5-5cfe8b043b29.jpg	Incredible Tuna designed with Frozen for blond performance	f	1	194	2025-01-16 15:51:52.222+00	2025-01-16 15:51:52.222+00
580	https://picsum.photos/seed/Nnibrem/3852/513	8cdf0805-2f8c-4bfd-9b69-91909b490f70.jpg	Innovative Computer featuring excellent technology and Frozen construction	f	10	195	2025-01-16 15:51:52.388+00	2025-01-16 15:51:52.388+00
581	https://picsum.photos/seed/cvpxecoA/2070/3801	76e140f3-e25c-4100-a2d3-b1d56ff4b4c7.jpg	The Persevering next generation moderator Computer offers reliable performance and quick-witted design	f	3	195	2025-01-16 15:51:52.471+00	2025-01-16 15:51:52.471+00
582	https://loremflickr.com/3600/676?lock=1174911418767279	540af4ec-bd2d-4379-80bb-ccfe8cbdb8ac.jpg	Introducing the Nigeria-inspired Shirt, blending helpless style with local craftsmanship	f	9	195	2025-01-16 15:51:52.566+00	2025-01-16 15:51:52.566+00
583	https://loremflickr.com/3865/2299?lock=7933897082578943	915778fc-f8e3-4b74-99f5-08e1b9504c8f.jpg	Harris, Gerlach and Auer's most advanced Table technology increases minty capabilities	f	1	196	2025-01-16 15:51:52.751+00	2025-01-16 15:51:52.751+00
584	https://picsum.photos/seed/ynJpu/2418/3032	d2ac8819-d698-42f0-a985-49de50c30029.jpg	Unbranded Shirt designed with Fresh for actual performance	f	5	196	2025-01-16 15:51:52.831+00	2025-01-16 15:51:52.831+00
585	https://loremflickr.com/3926/3358?lock=3374671279173998	e17293b8-f3bb-4922-9ca1-b53d6b2d8a94.jpg	Discover the unfit new Sausages with an exciting mix of Concrete ingredients	f	3	196	2025-01-16 15:51:52.922+00	2025-01-16 15:51:52.922+00
586	https://loremflickr.com/154/3967?lock=6404189404471829	4fdc1cf6-d13e-4c52-b10e-fd623bfb1823.jpg	The Organic optimal leverage Car offers reliable performance and ashamed design	f	8	197	2025-01-16 15:51:54.456+00	2025-01-16 15:51:54.456+00
587	https://picsum.photos/seed/kQUgX/1326/157	e3fc1a41-4c75-44e3-8a31-d7816d0e9190.jpg	The maroon Hat combines Jersey aesthetics with Molybdenum-based durability	f	6	197	2025-01-16 15:51:54.536+00	2025-01-16 15:51:54.536+00
588	https://picsum.photos/seed/C1Y5u/102/1616	b01c1f9f-4278-4004-9113-931d7c290a06.jpg	Professional-grade Bike perfect for wilted training and recreational use	f	6	197	2025-01-16 15:51:54.627+00	2025-01-16 15:51:54.627+00
589	https://picsum.photos/seed/LCi5kqMq/289/1987	62478898-7cd0-4644-acc3-9f0142a9f65d.jpg	The sleek and teeming Soap comes with gold LED lighting for smart functionality	f	6	198	2025-01-16 15:51:54.836+00	2025-01-16 15:51:54.836+00
590	https://picsum.photos/seed/8HHsdb1Bo/3475/1839	d1e16070-45e3-452a-8086-47871e4859b8.jpg	Savor the salty essence in our Chicken, designed for wiggly culinary adventures	f	5	198	2025-01-16 15:51:54.923+00	2025-01-16 15:51:54.923+00
591	https://loremflickr.com/3918/2142?lock=124828553785175	ed4e1faf-1ef4-4e89-81ea-6a891ed1e5bb.jpg	Savor the smoky essence in our Towels, designed for competent culinary adventures	f	8	198	2025-01-16 15:51:55.016+00	2025-01-16 15:51:55.016+00
592	https://loremflickr.com/2861/2779?lock=2512853326718775	6cb82b27-1b63-4829-a173-02fc552d291f.jpg	The Liliane Tuna is the latest in a series of pertinent products from Feest and Sons	f	10	199	2025-01-16 15:51:55.186+00	2025-01-16 15:51:55.186+00
593	https://loremflickr.com/1363/1302?lock=5968835583813675	6e20ac48-3342-4232-959e-e6fb6f7b4301.jpg	Discover the ostrich-like agility of our Shoes, perfect for crafty users	f	0	199	2025-01-16 15:51:55.273+00	2025-01-16 15:51:55.273+00
594	https://picsum.photos/seed/ve7vdP1FV/3281/1347	034e3461-27ae-4981-acd7-a490ad88c413.jpg	Experience the violet brilliance of our Tuna, perfect for mysterious environments	f	2	199	2025-01-16 15:51:55.353+00	2025-01-16 15:51:55.353+00
595	https://picsum.photos/seed/wKrzOuH8G2/3870/1444	5e5cfde6-596d-4d39-a9ba-8592a69eb7c0.jpg	The pink Hat combines Saint Kitts and Nevis aesthetics with Terbium-based durability	f	10	200	2025-01-16 15:51:55.52+00	2025-01-16 15:51:55.52+00
596	https://picsum.photos/seed/qtcyX/1203/81	bbb155ba-11a9-4633-a5eb-8fd26ad75d44.jpg	Introducing the Tajikistan-inspired Salad, blending courageous style with local craftsmanship	f	5	200	2025-01-16 15:51:55.597+00	2025-01-16 15:51:55.597+00
597	https://picsum.photos/seed/enuNREEGL/1041/2735	f29f8716-e72b-4b20-8728-2e8ef051d2f0.jpg	The Sustainable incremental projection Gloves offers reliable performance and linear design	f	4	200	2025-01-16 15:51:55.692+00	2025-01-16 15:51:55.692+00
598	https://loremflickr.com/2395/274?lock=7508317165804134	c3db834b-93e4-4924-be10-441ef9b345bf.jpg	New Hat model with 33 GB RAM, 480 GB storage, and dapper features	f	5	201	2025-01-16 15:51:55.864+00	2025-01-16 15:51:55.864+00
599	https://picsum.photos/seed/EpZoi/3865/2952	797d22eb-49c9-45c5-94a1-3dbd11046be8.jpg	Our gecko-friendly Towels ensures shiny comfort for your pets	f	4	201	2025-01-16 15:51:55.942+00	2025-01-16 15:51:55.942+00
600	https://loremflickr.com/829/78?lock=1732158800646276	2317ffa9-4900-48be-b399-6f99f7912fdc.jpg	The Decentralized hybrid approach Chicken offers reliable performance and submissive design	f	6	201	2025-01-16 15:51:56.021+00	2025-01-16 15:51:56.021+00
601	https://picsum.photos/seed/dyPGDuo/3027/2215	4f7013ae-882d-41e1-805a-da6605623948.jpg	New pink Car with ergonomic design for glossy comfort	f	4	202	2025-01-16 15:51:56.19+00	2025-01-16 15:51:56.19+00
602	https://picsum.photos/seed/w3cz6NS/1300/1540	c3dc74e3-11a5-4388-81c2-7c673a36772c.jpg	The Miracle Chicken is the latest in a series of nice products from Abernathy and Sons	f	8	202	2025-01-16 15:51:56.282+00	2025-01-16 15:51:56.282+00
603	https://picsum.photos/seed/X1NSHA/221/1016	1d97a88e-d204-4f6b-ae28-4b54f65b32b2.jpg	The Advanced composite knowledge base Car offers reliable performance and bright design	f	0	202	2025-01-16 15:51:56.372+00	2025-01-16 15:51:56.372+00
604	https://loremflickr.com/2987/435?lock=1989203172190926	b3bd9d7f-ee0e-4cd9-a0a4-9971b0ba773b.jpg	Our savory-inspired Fish brings a taste of luxury to your diligent lifestyle	f	2	203	2025-01-16 15:51:56.535+00	2025-01-16 15:51:56.535+00
605	https://loremflickr.com/253/2883?lock=361388072130476	e9fbeab2-ebe1-48b9-8717-8f8e1319005c.jpg	The Innovative logistical benchmark Bacon offers reliable performance and wobbly design	f	4	203	2025-01-16 15:51:56.624+00	2025-01-16 15:51:56.624+00
606	https://loremflickr.com/947/1691?lock=5426586177826925	1b9d6e26-80e4-4dd5-947d-241ba5fbf5fc.jpg	Discover the accomplished new Gloves with an exciting mix of Metal ingredients	f	5	203	2025-01-16 15:51:56.712+00	2025-01-16 15:51:56.713+00
607	https://loremflickr.com/1993/250?lock=8161375559983519	671cd0f4-2d09-4a16-a641-7163a3cfe2da.jpg	Our cat-friendly Sausages ensures educated comfort for your pets	f	1	204	2025-01-16 15:51:56.888+00	2025-01-16 15:51:56.888+00
608	https://picsum.photos/seed/yr448SdF/3935/2908	2a3c419b-2256-4e19-a800-0ba1cc1055de.jpg	The turquoise Towels combines Iraq aesthetics with Magnesium-based durability	f	6	204	2025-01-16 15:51:56.969+00	2025-01-16 15:51:56.969+00
609	https://loremflickr.com/3375/2764?lock=6894514951548676	2d106cc6-b0d8-431b-90ca-f30be90399b4.jpg	Introducing the France-inspired Towels, blending friendly style with local craftsmanship	f	9	204	2025-01-16 15:51:57.063+00	2025-01-16 15:51:57.063+00
610	https://picsum.photos/seed/DU7rbMu0/1215/444	21961a8b-f614-45ce-a524-79d4d08a7467.jpg	The Automated next generation website Cheese offers reliable performance and content design	f	6	205	2025-01-16 15:51:57.226+00	2025-01-16 15:51:57.226+00
611	https://picsum.photos/seed/hf4usZK/1602/1257	19063c9d-581e-4937-9309-31fcc2039eef.jpg	Experience the olive brilliance of our Sausages, perfect for humble environments	f	4	205	2025-01-16 15:51:57.313+00	2025-01-16 15:51:57.313+00
612	https://loremflickr.com/1527/3307?lock=6385080217254703	311b078e-d56c-4ffd-a60a-c3352d4d1552.jpg	The sleek and recent Table comes with magenta LED lighting for smart functionality	f	8	205	2025-01-16 15:51:57.4+00	2025-01-16 15:51:57.4+00
613	https://picsum.photos/seed/N4Jwq73iAq/2159/3328	96b4c25a-0b0a-45ae-a11a-a3a2c4d3b3c4.jpg	The tan Towels combines Tajikistan aesthetics with Meitnerium-based durability	f	9	206	2025-01-16 15:51:57.557+00	2025-01-16 15:51:57.558+00
614	https://picsum.photos/seed/rMuzYkG/1366/2633	3b55d30f-b437-4994-bb61-8bff9b892692.jpg	The silver Sausages combines Turkey aesthetics with Flerovium-based durability	f	4	206	2025-01-16 15:51:57.637+00	2025-01-16 15:51:57.637+00
615	https://picsum.photos/seed/5XkaDVzn/792/3546	2b6360df-c6e2-42e3-bc6a-f5ea8acf84a8.jpg	Discover the another new Soap with an exciting mix of Fresh ingredients	f	9	206	2025-01-16 15:51:57.716+00	2025-01-16 15:51:57.716+00
616	https://picsum.photos/seed/HyIo5sYh/195/2872	ce8fb1f8-5565-4908-9d79-00a3e88d5cfd.jpg	Our turtle-friendly Bike ensures menacing comfort for your pets	f	2	207	2025-01-16 15:51:57.901+00	2025-01-16 15:51:57.901+00
617	https://picsum.photos/seed/yluMhk/2258/1852	ce2b5d0c-efad-42b0-9aa9-150143acc59e.jpg	Ergonomic Bike made with Wooden for all-day beneficial support	f	8	207	2025-01-16 15:51:57.985+00	2025-01-16 15:51:57.985+00
618	https://picsum.photos/seed/lmf5sUIWB/444/15	26dd4bf6-8152-459b-8653-d2880251181d.jpg	Our tender-inspired Pants brings a taste of luxury to your unwieldy lifestyle	f	10	207	2025-01-16 15:51:58.083+00	2025-01-16 15:51:58.083+00
619	https://loremflickr.com/3164/3287?lock=5408170330469885	d480d810-69c4-4ae0-878d-ee1720348e3a.jpg	Discover the zebra-like agility of our Mouse, perfect for partial users	f	6	208	2025-01-16 15:51:58.257+00	2025-01-16 15:51:58.257+00
620	https://loremflickr.com/1092/2148?lock=8421432330488260	99a3fb20-5d93-4b0d-afe7-67f19b4156ba.jpg	Hettinger - Barrows's most advanced Salad technology increases charming capabilities	f	8	208	2025-01-16 15:51:58.337+00	2025-01-16 15:51:58.337+00
621	https://loremflickr.com/406/1782?lock=286483547451312	aa07b1aa-a732-41d2-836e-454edfe94fe2.jpg	New orchid Computer with ergonomic design for unpleasant comfort	f	9	208	2025-01-16 15:51:58.433+00	2025-01-16 15:51:58.433+00
622	https://picsum.photos/seed/mi6BkbEzZ/1502/612	492ddf9f-3a36-4ced-8d20-04754effd6cb.jpg	New yellow Keyboard with ergonomic design for enchanting comfort	f	1	209	2025-01-16 15:51:58.604+00	2025-01-16 15:51:58.604+00
623	https://picsum.photos/seed/mH1V82V/961/1807	dfcc7390-58fc-466b-a5c7-49523f1cdd1a.jpg	Ergonomic Chicken made with Concrete for all-day strident support	f	6	209	2025-01-16 15:51:58.69+00	2025-01-16 15:51:58.69+00
624	https://loremflickr.com/3776/2205?lock=7062499368213850	9809a2b2-fac4-4d99-942a-caba43491a55.jpg	Introducing the Cuba-inspired Pants, blending empty style with local craftsmanship	f	2	209	2025-01-16 15:51:58.782+00	2025-01-16 15:51:58.782+00
625	https://loremflickr.com/3614/1317?lock=6263328510383290	f0459405-bb6d-44f4-915a-720d81bccf9f.jpg	The sleek and ripe Sausages comes with blue LED lighting for smart functionality	f	4	210	2025-01-16 15:52:02.403+00	2025-01-16 15:52:02.403+00
626	https://loremflickr.com/2998/2647?lock=6454839279828591	612d955b-89a4-4fe5-826b-bf4168a660fa.jpg	Introducing the Christmas Island-inspired Cheese, blending biodegradable style with local craftsmanship	f	9	210	2025-01-16 15:52:02.482+00	2025-01-16 15:52:02.482+00
627	https://picsum.photos/seed/esFEU4/2030/3082	01e4a151-01c3-4e29-940f-12a129fb4207.jpg	Ergonomic Chips made with Rubber for all-day all support	f	10	210	2025-01-16 15:52:02.569+00	2025-01-16 15:52:02.569+00
628	https://picsum.photos/seed/Sof7iqOmI/3972/2476	ac932747-18d7-43f1-8476-e5340b078c5c.jpg	Featuring Potassium-enhanced technology, our Bike offers unparalleled motionless performance	f	9	211	2025-01-16 15:52:02.728+00	2025-01-16 15:52:02.728+00
629	https://picsum.photos/seed/9MOWfHM/781/3128	f3d00d50-8d0d-4c68-8837-0ba407e36471.jpg	New mint green Table with ergonomic design for international comfort	f	10	211	2025-01-16 15:52:02.816+00	2025-01-16 15:52:02.816+00
630	https://picsum.photos/seed/gDE5OzK/2561/1174	b8d558fe-d2b1-4d19-9883-cb343ac0d9ea.jpg	New Bacon model with 61 GB RAM, 86 GB storage, and silver features	f	2	211	2025-01-16 15:52:02.896+00	2025-01-16 15:52:02.896+00
631	https://loremflickr.com/1570/377?lock=6376900377344380	8775c617-0640-4444-9e9a-b5935c65a195.jpg	Professional-grade Bike perfect for educated training and recreational use	f	2	212	2025-01-16 15:52:03.084+00	2025-01-16 15:52:03.084+00
632	https://picsum.photos/seed/WmkCss/2733/3401	57571144-cf25-4c47-8b12-75f5cb9ac2ec.jpg	Ergonomic Fish made with Bronze for all-day frivolous support	f	4	212	2025-01-16 15:52:03.17+00	2025-01-16 15:52:03.17+00
633	https://picsum.photos/seed/9UoUNBu/2000/22	fdec2442-9748-43cc-8930-8c5231bd7e27.jpg	Featuring Selenium-enhanced technology, our Cheese offers unparalleled outgoing performance	f	8	212	2025-01-16 15:52:03.252+00	2025-01-16 15:52:03.252+00
634	https://picsum.photos/seed/yj2Dc1/537/3621	33278ae1-ce46-49cd-9378-d6e11d89009b.jpg	Experience the salmon brilliance of our Hat, perfect for muted environments	f	2	213	2025-01-16 15:52:03.426+00	2025-01-16 15:52:03.426+00
635	https://loremflickr.com/3941/3034?lock=7457652645877008	7778b001-8b8c-496b-bf48-622aa4ccf2b8.jpg	Discover the hamster-like agility of our Shirt, perfect for dim users	f	8	213	2025-01-16 15:52:03.504+00	2025-01-16 15:52:03.505+00
636	https://loremflickr.com/3498/591?lock=2267562254118695	d0ef5d86-354a-4087-bf2d-ed7c31873274.jpg	Ergonomic Chips made with Frozen for all-day exalted support	f	1	213	2025-01-16 15:52:03.583+00	2025-01-16 15:52:03.583+00
637	https://loremflickr.com/2469/541?lock=8920355444572039	d864b904-5125-4cc7-8844-7568aa0e6a85.jpg	Savor the juicy essence in our Pizza, designed for sardonic culinary adventures	f	4	214	2025-01-16 15:52:03.741+00	2025-01-16 15:52:03.741+00
638	https://loremflickr.com/2664/3326?lock=8458586922513372	5f479a6e-f06a-4179-801d-c152afdbc4bb.jpg	Our eagle-friendly Cheese ensures exhausted comfort for your pets	f	8	214	2025-01-16 15:52:03.823+00	2025-01-16 15:52:03.824+00
639	https://picsum.photos/seed/BCedh/2995/1896	e487928f-56bc-4611-aa8d-a1ba2f4e439e.jpg	Our snake-friendly Keyboard ensures foolhardy comfort for your pets	f	10	214	2025-01-16 15:52:03.919+00	2025-01-16 15:52:03.919+00
640	https://loremflickr.com/1720/3075?lock=5577003548949967	ff3f550e-6835-4733-aed3-8554393ffb40.jpg	Savor the delicious essence in our Table, designed for earnest culinary adventures	f	1	215	2025-01-16 15:52:04.096+00	2025-01-16 15:52:04.096+00
641	https://picsum.photos/seed/SiJzcz/2154/158	2cc41be7-c834-4b29-a489-6668d130a0eb.jpg	Discover the total new Bike with an exciting mix of Granite ingredients	f	10	215	2025-01-16 15:52:04.174+00	2025-01-16 15:52:04.174+00
642	https://loremflickr.com/842/2945?lock=6113963765389637	fe5f56e1-38cd-4b48-92ff-3c1866b0d27d.jpg	Our golden-inspired Chicken brings a taste of luxury to your white lifestyle	f	1	215	2025-01-16 15:52:04.252+00	2025-01-16 15:52:04.252+00
643	https://picsum.photos/seed/uvcFJ/878/3555	35d85210-2a32-4e4c-a66c-4785588c733b.jpg	Experience the blue brilliance of our Keyboard, perfect for enchanting environments	f	1	216	2025-01-16 15:52:06.607+00	2025-01-16 15:52:06.607+00
644	https://picsum.photos/seed/liQqiNWnr2/75/3436	78d4595e-fae0-4b26-8fc1-471aeb1f8cf5.jpg	Featuring Radon-enhanced technology, our Car offers unparalleled pretty performance	f	1	216	2025-01-16 15:52:06.688+00	2025-01-16 15:52:06.688+00
645	https://loremflickr.com/2561/151?lock=5535093869871238	e167f45f-77f8-4ef3-acf9-1d63c1043aee.jpg	Introducing the Argentina-inspired Chair, blending tough style with local craftsmanship	f	8	216	2025-01-16 15:52:06.775+00	2025-01-16 15:52:06.775+00
646	https://picsum.photos/seed/ibIZOKF6/1556/2031	4b51917d-3ba0-4bb4-8f3d-5d5f754a5ded.jpg	Discover the bee-like agility of our Table, perfect for complete users	f	2	217	2025-01-16 15:52:06.966+00	2025-01-16 15:52:06.966+00
647	https://loremflickr.com/225/1396?lock=6514839712982710	b6942b47-198b-4bcc-82d6-c92e4beab13b.jpg	Featuring Zirconium-enhanced technology, our Hat offers unparalleled general performance	f	0	217	2025-01-16 15:52:07.05+00	2025-01-16 15:52:07.05+00
648	https://loremflickr.com/3240/1111?lock=3163420620008811	2ea12483-f486-442e-87bc-a54b3be3ae7b.jpg	Johnston - Rempel's most advanced Sausages technology increases nocturnal capabilities	f	6	217	2025-01-16 15:52:07.14+00	2025-01-16 15:52:07.141+00
649	https://picsum.photos/seed/QGfmbK/3429/1874	74ae85f8-bb00-4c28-8964-3e822e985565.jpg	Our polar bear-friendly Shoes ensures natural comfort for your pets	f	4	218	2025-01-16 15:52:07.315+00	2025-01-16 15:52:07.316+00
650	https://picsum.photos/seed/3TFqo/2331/1330	e6240bb3-aaaa-4666-86cf-6a03c028427d.jpg	New Ball model with 13 GB RAM, 357 GB storage, and brisk features	f	9	218	2025-01-16 15:52:07.406+00	2025-01-16 15:52:07.406+00
651	https://loremflickr.com/632/3828?lock=4358739140545122	d201a21d-3d3b-4c93-a909-27b7362a7eb4.jpg	Featuring Promethium-enhanced technology, our Mouse offers unparalleled showy performance	f	2	218	2025-01-16 15:52:07.492+00	2025-01-16 15:52:07.492+00
652	https://loremflickr.com/773/1674?lock=1441082101178590	ee4cfc6e-0523-4e51-8adf-a76917639ccf.jpg	Ergonomic Car made with Bronze for all-day exhausted support	f	3	219	2025-01-16 15:52:07.66+00	2025-01-16 15:52:07.66+00
653	https://loremflickr.com/353/1788?lock=1623911628267694	8bf65c33-cc56-4683-9367-ccda2f177e81.jpg	Discover the flamingo-like agility of our Fish, perfect for red users	f	0	219	2025-01-16 15:52:07.738+00	2025-01-16 15:52:07.738+00
654	https://picsum.photos/seed/dSkU9p/2838/80	19d120a1-26b4-4d35-8625-5f6a03e63baa.jpg	Discover the parrot-like agility of our Chair, perfect for boiling users	f	4	219	2025-01-16 15:52:07.82+00	2025-01-16 15:52:07.82+00
655	https://loremflickr.com/837/421?lock=6484113354840816	b9ecce3b-953f-45cf-8609-574aa67f8c99.jpg	Ergonomic Soap made with Concrete for all-day yellowish support	f	3	220	2025-01-16 15:52:07.999+00	2025-01-16 15:52:07.999+00
656	https://loremflickr.com/1327/1378?lock=3523712147994395	8698f117-f095-4f79-8401-0f9e9249f26d.jpg	Discover the squirrel-like agility of our Soap, perfect for difficult users	f	8	220	2025-01-16 15:52:08.084+00	2025-01-16 15:52:08.084+00
657	https://picsum.photos/seed/A2JjFEPEcU/2508/3359	33e48abd-cc3c-45c9-81f7-741da0bd086b.jpg	Tromp Group's most advanced Ball technology increases another capabilities	f	3	220	2025-01-16 15:52:08.161+00	2025-01-16 15:52:08.161+00
658	https://loremflickr.com/2148/46?lock=7493932574871692	f9c225ae-dc38-4633-a407-8edb419c9e8c.jpg	The maroon Bacon combines Honduras aesthetics with Beryllium-based durability	f	9	221	2025-01-16 15:52:08.329+00	2025-01-16 15:52:08.329+00
659	https://loremflickr.com/1832/2197?lock=7500941688325431	4895b70d-e3ea-4238-bfc4-2ec18df0490d.jpg	Savor the juicy essence in our Chicken, designed for incomplete culinary adventures	f	10	221	2025-01-16 15:52:08.44+00	2025-01-16 15:52:08.44+00
660	https://loremflickr.com/2225/1010?lock=613216130764392	17a80d59-4dde-433f-a492-2e2e8168cf83.jpg	Experience the lavender brilliance of our Chair, perfect for failing environments	f	9	221	2025-01-16 15:52:08.532+00	2025-01-16 15:52:08.532+00
661	https://loremflickr.com/390/712?lock=6334678228832090	e5657eef-83dc-436f-9019-f164cd36c00c.jpg	Stylish Towels designed to make you stand out with inexperienced looks	f	2	222	2025-01-16 15:52:08.704+00	2025-01-16 15:52:08.704+00
662	https://loremflickr.com/3193/2592?lock=4272832063703324	342c6d7d-df00-47e5-8cba-ff6726de7081.jpg	The Implemented systematic circuit Computer offers reliable performance and wicked design	f	5	222	2025-01-16 15:52:08.798+00	2025-01-16 15:52:08.798+00
663	https://loremflickr.com/1262/2247?lock=4135912190520742	912b3974-1e49-4921-950a-44bcf92dcc25.jpg	Electronic Hat designed with Concrete for focused performance	f	10	222	2025-01-16 15:52:09.042+00	2025-01-16 15:52:09.042+00
664	https://loremflickr.com/1430/1683?lock=2133424409485523	72d19708-ccf6-480f-8a10-99077cf02ab2.jpg	Introducing the Ghana-inspired Bacon, blending lucky style with local craftsmanship	f	9	223	2025-01-16 15:52:11.135+00	2025-01-16 15:52:11.135+00
665	https://loremflickr.com/1279/1782?lock=3921960365908437	ac4075d3-7478-4478-92be-5fb6f2cf3058.jpg	The sleek and warmhearted Fish comes with turquoise LED lighting for smart functionality	f	6	223	2025-01-16 15:52:11.216+00	2025-01-16 15:52:11.217+00
666	https://picsum.photos/seed/NYwnDFn/3913/1257	dcf3f759-1286-4532-b1c5-24405dec3085.jpg	Stylish Hat designed to make you stand out with unripe looks	f	0	223	2025-01-16 15:52:11.302+00	2025-01-16 15:52:11.302+00
667	https://picsum.photos/seed/SUJc5x/186/2926	d0dd3167-cf33-48b0-bbb0-6ba5afb2b76f.jpg	Feeney Group's most advanced Sausages technology increases discrete capabilities	f	7	224	2025-01-16 15:52:11.463+00	2025-01-16 15:52:11.463+00
668	https://picsum.photos/seed/ZJ6u8/1522/1553	b775a0b0-0ddb-462e-a39b-42a7c916461b.jpg	The Carter Chair is the latest in a series of shameful products from Mayer, Heaney and Steuber	f	2	224	2025-01-16 15:52:11.549+00	2025-01-16 15:52:11.549+00
669	https://picsum.photos/seed/yg0IBz/1818/2942	c737d3b7-0463-454d-bfd2-1414a0338d34.jpg	The teal Salad combines Isle of Man aesthetics with Potassium-based durability	f	4	224	2025-01-16 15:52:11.627+00	2025-01-16 15:52:11.627+00
670	https://loremflickr.com/129/103?lock=6895265441646111	da8cca55-ba89-4872-8c0e-f3ceeb074339.jpg	The Kaycee Mouse is the latest in a series of fatal products from Connelly - Hansen	f	4	225	2025-01-16 15:52:11.791+00	2025-01-16 15:52:11.791+00
671	https://loremflickr.com/1118/2062?lock=308901495571492	af6145fa-ccd8-4a43-8ad7-d56096162e92.jpg	Introducing the Angola-inspired Towels, blending frightened style with local craftsmanship	f	4	225	2025-01-16 15:52:11.878+00	2025-01-16 15:52:11.878+00
672	https://picsum.photos/seed/DFzTn/2194/2355	8b6db12d-24b5-41a0-b704-bb1e7dfabfb2.jpg	Innovative Mouse featuring perfumed technology and Metal construction	f	4	225	2025-01-16 15:52:11.965+00	2025-01-16 15:52:11.965+00
673	https://picsum.photos/seed/douQim6kxC/3800/1473	8e26848a-8da5-465f-956f-ade2aa5aa6d8.jpg	Innovative Pizza featuring happy technology and Rubber construction	f	0	226	2025-01-16 15:52:12.14+00	2025-01-16 15:52:12.14+00
674	https://picsum.photos/seed/jQnJcEzMiR/216/3503	e496587c-9347-4a60-ba5d-b5de4fe1400a.jpg	New Pants model with 43 GB RAM, 46 GB storage, and excitable features	f	8	226	2025-01-16 15:52:12.219+00	2025-01-16 15:52:12.219+00
675	https://picsum.photos/seed/cMkZqAXK/2427/1269	c2242770-358d-4fd4-9b2e-19833bb530d0.jpg	Discover the cow-like agility of our Computer, perfect for brisk users	f	2	226	2025-01-16 15:52:12.298+00	2025-01-16 15:52:12.298+00
676	https://loremflickr.com/2847/3397?lock=1512858318401075	6c6216a1-a45e-4796-a4fc-771a193064ef.jpg	Innovative Car featuring tough technology and Fresh construction	f	6	227	2025-01-16 15:52:12.477+00	2025-01-16 15:52:12.477+00
677	https://picsum.photos/seed/Gvs2LBZG/3970/2294	30d2dd2f-f99e-47ea-9a86-0faa36bb7518.jpg	Ergonomic Shoes made with Bronze for all-day ambitious support	f	7	227	2025-01-16 15:52:12.565+00	2025-01-16 15:52:12.566+00
678	https://loremflickr.com/1396/3768?lock=6905047625663041	1024bb8a-dddc-4e4a-968b-551e746d239e.jpg	Stamm, Botsford and Gerhold's most advanced Chair technology increases flustered capabilities	f	1	227	2025-01-16 15:52:12.651+00	2025-01-16 15:52:12.651+00
679	https://loremflickr.com/575/3273?lock=3136930814235249	6b3277db-b900-4b1a-b971-57250acdcc27.jpg	Discover the imaginary new Ball with an exciting mix of Steel ingredients	f	10	228	2025-01-16 15:52:14.219+00	2025-01-16 15:52:14.219+00
680	https://picsum.photos/seed/tZwnByMIgf/740/3098	2b9b6b89-a950-41c7-8c29-46a2ef6e29d1.jpg	Professional-grade Hat perfect for merry training and recreational use	f	7	228	2025-01-16 15:52:14.306+00	2025-01-16 15:52:14.306+00
681	https://picsum.photos/seed/7LGen/2121/234	8c22d0af-f654-4621-a70f-da0e4550b64f.jpg	New purple Hat with ergonomic design for ripe comfort	f	1	228	2025-01-16 15:52:14.386+00	2025-01-16 15:52:14.386+00
682	https://loremflickr.com/415/3929?lock=5976449967606997	0c88d8c6-56d1-4e06-aaeb-0c707f7128d5.jpg	Discover the polished new Pizza with an exciting mix of Soft ingredients	f	9	229	2025-01-16 15:52:14.578+00	2025-01-16 15:52:14.578+00
683	https://loremflickr.com/3973/1041?lock=7667179870084780	44e47b47-a8c6-4db7-9ca1-6b0a8a297f42.jpg	Discover the frog-like agility of our Hat, perfect for rapid users	f	1	229	2025-01-16 15:52:14.669+00	2025-01-16 15:52:14.669+00
684	https://loremflickr.com/2717/2917?lock=8454744850039615	7e026d5c-5ee1-4345-8f0c-ba98ca090fe8.jpg	Savor the bitter essence in our Keyboard, designed for frugal culinary adventures	f	2	229	2025-01-16 15:52:14.764+00	2025-01-16 15:52:14.764+00
685	https://picsum.photos/seed/C5pxPvCHE0/2456/2002	bd37f8d2-8a72-4dbd-ba2d-92c6a89a06cb.jpg	The fuchsia Gloves combines United States Minor Outlying Islands aesthetics with Scandium-based durability	f	9	230	2025-01-16 15:52:14.937+00	2025-01-16 15:52:14.937+00
686	https://loremflickr.com/2980/2196?lock=889786645282698	c9ce3189-1b60-4cc3-958b-cc9be1684089.jpg	Experience the blue brilliance of our Gloves, perfect for ugly environments	f	7	230	2025-01-16 15:52:15.014+00	2025-01-16 15:52:15.014+00
687	https://loremflickr.com/603/1661?lock=3757731885387197	062480c8-4d69-4e9e-b721-cb0063f43dac.jpg	Ullrich, Fritsch and Rowe's most advanced Shirt technology increases impartial capabilities	f	1	230	2025-01-16 15:52:15.094+00	2025-01-16 15:52:15.094+00
688	https://loremflickr.com/2515/339?lock=8501424344995624	93ab3582-9b6f-44b0-b460-3d97d93cfada.jpg	The Jayne Keyboard is the latest in a series of staid products from Schmeler - Olson	f	0	231	2025-01-16 15:52:15.256+00	2025-01-16 15:52:15.256+00
689	https://loremflickr.com/3813/2664?lock=944903630154643	3fb575c8-3e2e-427e-9585-818eec98da04.jpg	New Ball model with 49 GB RAM, 768 GB storage, and measly features	f	3	231	2025-01-16 15:52:15.349+00	2025-01-16 15:52:15.349+00
690	https://loremflickr.com/1009/1794?lock=4669940708628361	a9bc8569-23f9-403f-9a59-26b029c8af7d.jpg	Innovative Mouse featuring incomparable technology and Cotton construction	f	8	231	2025-01-16 15:52:15.427+00	2025-01-16 15:52:15.427+00
691	https://loremflickr.com/2565/3345?lock=5062702601788028	253408fd-c492-4a5b-afdd-75ecb82d8f17.jpg	Innovative Shoes featuring cultivated technology and Soft construction	f	5	232	2025-01-16 15:52:15.596+00	2025-01-16 15:52:15.596+00
692	https://picsum.photos/seed/x57yw0Tbmn/3913/3436	1e21b565-a5ff-4729-be32-0397e3247907.jpg	Konopelski, Kilback and Schneider's most advanced Bacon technology increases yellow capabilities	f	7	232	2025-01-16 15:52:15.673+00	2025-01-16 15:52:15.673+00
693	https://loremflickr.com/2155/936?lock=3889288536469843	de7dacf6-4cd7-4762-9bc6-00a3b0bc7bbe.jpg	Featuring Sodium-enhanced technology, our Chicken offers unparalleled knowledgeable performance	f	2	232	2025-01-16 15:52:15.752+00	2025-01-16 15:52:15.753+00
694	https://loremflickr.com/3774/1260?lock=6684065301719732	a973fa7d-bd40-44f5-8819-ed440a2a8258.jpg	The pink Sausages combines Timor-Leste aesthetics with Iridium-based durability	f	3	233	2025-01-16 15:52:15.921+00	2025-01-16 15:52:15.921+00
695	https://picsum.photos/seed/kE6RU/3538/2451	f85f5951-0baa-4bea-8177-fbac713445ef.jpg	Innovative Computer featuring antique technology and Rubber construction	f	8	233	2025-01-16 15:52:16+00	2025-01-16 15:52:16+00
696	https://picsum.photos/seed/HeWNWsjFwy/762/636	9c7745bd-3f7f-4792-806e-87a8ec9890b7.jpg	Ergonomic Car made with Plastic for all-day lawful support	f	9	233	2025-01-16 15:52:16.078+00	2025-01-16 15:52:16.078+00
697	https://loremflickr.com/313/2313?lock=2524047184896472	5ab723ec-5d49-4ffc-8256-b316fb7f263f.jpg	Our juicy-inspired Chicken brings a taste of luxury to your husky lifestyle	f	7	234	2025-01-16 15:52:16.256+00	2025-01-16 15:52:16.256+00
698	https://loremflickr.com/3981/2767?lock=3244975659906375	66232d76-8e59-46be-9fd9-6c0bcf26f0b0.jpg	Experience the azure brilliance of our Hat, perfect for specific environments	f	4	234	2025-01-16 15:52:16.336+00	2025-01-16 15:52:16.336+00
699	https://picsum.photos/seed/vuv3RzjS/1176/1136	03db22ff-f128-4f76-87b3-787ddeeb2503.jpg	Savor the fluffy essence in our Fish, designed for grave culinary adventures	f	10	234	2025-01-16 15:52:16.423+00	2025-01-16 15:52:16.423+00
700	https://picsum.photos/seed/FmNZGr4/2218/2215	85027054-612a-4c89-979d-3e9f324a68aa.jpg	Experience the yellow brilliance of our Soap, perfect for back environments	f	9	235	2025-01-16 15:52:16.604+00	2025-01-16 15:52:16.604+00
701	https://loremflickr.com/2987/456?lock=3785374655675575	9add3ef8-bdc6-4935-8aa1-c056e8f2e8ab.jpg	The grey Sausages combines Guinea aesthetics with Strontium-based durability	f	8	235	2025-01-16 15:52:16.689+00	2025-01-16 15:52:16.689+00
702	https://loremflickr.com/247/2248?lock=5337570186902036	301f98cb-0e3b-4377-8d90-28abc220616c.jpg	The purple Cheese combines Guadeloupe aesthetics with Titanium-based durability	f	0	235	2025-01-16 15:52:16.77+00	2025-01-16 15:52:16.77+00
703	https://picsum.photos/seed/rxPcgtUbB/680/2320	0a80552c-49ea-4a5f-ada2-548900875cec.jpg	The sleek and juicy Ball comes with maroon LED lighting for smart functionality	f	6	236	2025-01-16 15:52:16.956+00	2025-01-16 15:52:16.956+00
704	https://picsum.photos/seed/iDd0z/3286/2251	da919738-4e07-462c-810c-66194562d5c3.jpg	Professional-grade Fish perfect for wee training and recreational use	f	5	236	2025-01-16 15:52:17.048+00	2025-01-16 15:52:17.048+00
705	https://picsum.photos/seed/jUvld1y/3303/2458	1030d8a0-f349-4f4a-b422-d6d0577849e1.jpg	Innovative Mouse featuring slight technology and Metal construction	f	9	236	2025-01-16 15:52:17.131+00	2025-01-16 15:52:17.132+00
706	https://picsum.photos/seed/kFZCde93lx/545/2494	811af59b-807d-4bb6-a021-592d7edea964.jpg	Discover the bee-like agility of our Shoes, perfect for whimsical users	f	0	237	2025-01-16 15:52:17.3+00	2025-01-16 15:52:17.3+00
707	https://loremflickr.com/2715/3118?lock=2180593173557297	52432c62-ee00-4d3b-a178-77e53bce98bc.jpg	New gold Computer with ergonomic design for soupy comfort	f	1	237	2025-01-16 15:52:17.38+00	2025-01-16 15:52:17.38+00
708	https://picsum.photos/seed/AJHiVg1iw/3857/3987	ff7c4539-ce2d-417b-9616-89e658a640ae.jpg	Stylish Sausages designed to make you stand out with total looks	f	4	237	2025-01-16 15:52:17.466+00	2025-01-16 15:52:17.466+00
709	https://picsum.photos/seed/lvdwxj9q/1064/3416	4bc67138-ea3b-4bce-85bc-86ec3b5ef4d7.jpg	Discover the fox-like agility of our Keyboard, perfect for exotic users	f	0	238	2025-01-16 15:52:17.634+00	2025-01-16 15:52:17.634+00
710	https://picsum.photos/seed/JofQD8ZUk/2945/3134	9be38631-6248-4e94-85c4-cc8605eb3e5e.jpg	Our whale-friendly Bike ensures official comfort for your pets	f	2	238	2025-01-16 15:52:17.713+00	2025-01-16 15:52:17.713+00
711	https://picsum.photos/seed/LF7JOyrm/3596/3505	a995980a-79fe-47b7-8e06-c858d3dc115d.jpg	Nienow - Legros's most advanced Gloves technology increases average capabilities	f	7	238	2025-01-16 15:52:17.805+00	2025-01-16 15:52:17.805+00
712	https://picsum.photos/seed/VLeqweIPxA/2117/1300	0c496ba5-77e6-44c0-8b57-449ec448d1ee.jpg	Introducing the Dominica-inspired Tuna, blending sandy style with local craftsmanship	f	9	239	2025-01-16 15:52:17.978+00	2025-01-16 15:52:17.978+00
713	https://loremflickr.com/1116/3215?lock=5243984487852847	dfa2bfbc-15c8-4049-9cfb-5f40d8b43922.jpg	Our fluffy-inspired Ball brings a taste of luxury to your lively lifestyle	f	7	239	2025-01-16 15:52:18.056+00	2025-01-16 15:52:18.056+00
714	https://picsum.photos/seed/ILB0rm6/608/2291	89d948ef-b389-466c-9b8f-83ea081a0b93.jpg	Innovative Tuna featuring caring technology and Soft construction	f	2	239	2025-01-16 15:52:18.14+00	2025-01-16 15:52:18.14+00
715	https://loremflickr.com/1408/420?lock=3970849310091655	e6904e2a-d5fa-4718-9053-3c2d0b8193f1.jpg	The sleek and functional Hat comes with lavender LED lighting for smart functionality	f	4	240	2025-01-16 15:52:21.415+00	2025-01-16 15:52:21.415+00
716	https://picsum.photos/seed/c9q0rw/3560/1731	b97db68c-27f6-43be-aa43-78ef74fc9ba5.jpg	The Intuitive maximized product Chicken offers reliable performance and favorite design	f	5	240	2025-01-16 15:52:21.494+00	2025-01-16 15:52:21.494+00
717	https://loremflickr.com/1421/1144?lock=4146944233075680	8c0bd68d-8659-4667-baaf-bfda405dfee3.jpg	The sleek and advanced Gloves comes with orange LED lighting for smart functionality	f	1	240	2025-01-16 15:52:21.572+00	2025-01-16 15:52:21.572+00
718	https://loremflickr.com/2626/534?lock=3518171814381914	29fdd1f6-6192-489e-987a-46552df896a9.jpg	Ergonomic Tuna made with Wooden for all-day black support	f	8	241	2025-01-16 15:52:21.741+00	2025-01-16 15:52:21.741+00
719	https://picsum.photos/seed/DBOmm0brr/2735/3479	90b66e03-4424-4fc4-b18a-090f4b50814d.jpg	Discover the horse-like agility of our Chicken, perfect for happy-go-lucky users	f	9	241	2025-01-16 15:52:21.83+00	2025-01-16 15:52:21.83+00
720	https://loremflickr.com/1660/3697?lock=3282144827133463	35bd7fb1-18d1-417f-8efc-122a9b3a60bf.jpg	Ergonomic Pizza made with Concrete for all-day sentimental support	f	3	241	2025-01-16 15:52:21.917+00	2025-01-16 15:52:21.917+00
721	https://picsum.photos/seed/tpx8Kln/2733/480	4ea67edf-f038-4628-b2f5-9c6ac7d98dd1.jpg	Experience the lavender brilliance of our Hat, perfect for good-natured environments	f	3	242	2025-01-16 15:52:22.087+00	2025-01-16 15:52:22.087+00
722	https://loremflickr.com/1506/158?lock=5698509769458370	0a220380-2d3d-4f9d-b3cb-15f7b67ea4c1.jpg	Savor the smoky essence in our Shoes, designed for terrible culinary adventures	f	9	242	2025-01-16 15:52:22.174+00	2025-01-16 15:52:22.174+00
723	https://picsum.photos/seed/T4xLDT/3702/2664	990b42d1-98a5-43f4-b0a2-982790c1aaf4.jpg	New Mouse model with 80 GB RAM, 35 GB storage, and breakable features	f	2	242	2025-01-16 15:52:22.264+00	2025-01-16 15:52:22.264+00
724	https://loremflickr.com/3620/2023?lock=463247522670248	97a8dd0a-a0d4-40b3-a97b-c76be718e070.jpg	Our flamingo-friendly Bacon ensures silky comfort for your pets	f	2	243	2025-01-16 15:52:22.43+00	2025-01-16 15:52:22.43+00
725	https://loremflickr.com/2119/200?lock=4346350918934092	595dc8ea-db54-4c1d-924a-e1031ccd0dd1.jpg	Professional-grade Table perfect for pleasing training and recreational use	f	0	243	2025-01-16 15:52:22.511+00	2025-01-16 15:52:22.511+00
726	https://loremflickr.com/3760/744?lock=7161829563273719	55fdbd1c-7a1e-4f43-853f-74ef0b797746.jpg	The Jed Computer is the latest in a series of shameless products from Botsford Inc	f	8	243	2025-01-16 15:52:22.6+00	2025-01-16 15:52:22.6+00
727	https://picsum.photos/seed/Jd216M/3678/1208	e082d210-74a4-4316-ada3-6852f1539768.jpg	Hauck - O'Keefe's most advanced Car technology increases right capabilities	f	9	244	2025-01-16 15:52:22.776+00	2025-01-16 15:52:22.776+00
728	https://picsum.photos/seed/kZfOE/1695/2405	f1cd277f-512e-4bb6-80a0-ebd8a0dcd300.jpg	Introducing the Ecuador-inspired Tuna, blending overcooked style with local craftsmanship	f	10	244	2025-01-16 15:52:22.861+00	2025-01-16 15:52:22.862+00
729	https://picsum.photos/seed/dlQwR1M2/1721/915	d5f0130a-4736-4ac4-aaad-c8097a4c8219.jpg	New Salad model with 92 GB RAM, 794 GB storage, and lawful features	f	0	244	2025-01-16 15:52:22.941+00	2025-01-16 15:52:22.942+00
730	https://picsum.photos/seed/MF9s1lCi/3004/2498	3e6009a7-43c2-4cfc-a0e7-40c64cb236d2.jpg	Our moist-inspired Tuna brings a taste of luxury to your strange lifestyle	f	3	245	2025-01-16 15:52:23.103+00	2025-01-16 15:52:23.104+00
731	https://loremflickr.com/1286/615?lock=1943166478935863	a2b7834d-7081-4e22-aa7a-16b3a42bc56e.jpg	Adams Inc's most advanced Bacon technology increases courteous capabilities	f	10	245	2025-01-16 15:52:23.187+00	2025-01-16 15:52:23.187+00
732	https://picsum.photos/seed/ZBrROWY2Qj/409/2655	ea3f6f4b-0e0d-4d7d-abc2-c12908d9139e.jpg	Our bird-friendly Chicken ensures all comfort for your pets	f	9	245	2025-01-16 15:52:23.266+00	2025-01-16 15:52:23.266+00
733	https://loremflickr.com/3946/1765?lock=290112182510355	13e37836-e27c-4941-b88d-d372c233142d.jpg	Discover the parrot-like agility of our Shirt, perfect for emotional users	f	3	246	2025-01-16 15:52:23.425+00	2025-01-16 15:52:23.425+00
734	https://loremflickr.com/94/3837?lock=6848492762411461	0ade6dbd-15f5-44f1-88f2-65a9fd6382f9.jpg	Discover the stupendous new Ball with an exciting mix of Concrete ingredients	f	3	246	2025-01-16 15:52:23.512+00	2025-01-16 15:52:23.512+00
735	https://loremflickr.com/986/1138?lock=8898944697086025	f0ddc6de-1301-4a94-8382-124704ef4123.jpg	Our peacock-friendly Gloves ensures dark comfort for your pets	f	1	246	2025-01-16 15:52:23.591+00	2025-01-16 15:52:23.592+00
736	https://loremflickr.com/247/3923?lock=6198552537421951	ae5c7d0b-71c1-4894-b554-43a9c51027a0.jpg	Featuring Hydrogen-enhanced technology, our Pants offers unparalleled serpentine performance	f	7	247	2025-01-16 15:52:23.765+00	2025-01-16 15:52:23.765+00
737	https://picsum.photos/seed/OZV0W/709/717	e1a10733-00a5-44e2-9fb2-b56335ecc0e6.jpg	Discover the parallel new Fish with an exciting mix of Frozen ingredients	f	5	247	2025-01-16 15:52:23.868+00	2025-01-16 15:52:23.868+00
738	https://picsum.photos/seed/HmyNCZK/1260/1557	6e10b85b-8d0d-4d3a-bd9f-6b5a650ad41a.jpg	The Multi-tiered national workforce Sausages offers reliable performance and livid design	f	6	247	2025-01-16 15:52:23.955+00	2025-01-16 15:52:23.956+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.products (id, name, description, price, sku, is_active, tenant_id, created_at, updated_at, is_marketplace_visible, marketplace_priority, average_rating) FROM stdin;
51	Intelligent Frozen Chair	Experience the sky blue brilliance of our Chips, perfect for cultivated environments	78.05	0N9J4NBY	t	3	2025-01-16 15:15:27.255+00	2025-01-16 15:15:27.255+00	t	84	1.84
52	Luxurious Rubber Soap	The Macey Sausages is the latest in a series of advanced products from Howe Group	793.79	R1YQCTPG	t	3	2025-01-16 15:15:27.586+00	2025-01-16 15:15:27.586+00	t	84	3.29
53	Handmade Metal Car	Experience the sky blue brilliance of our Towels, perfect for all environments	480.99	E7FSDRAB	t	3	2025-01-16 15:15:27.931+00	2025-01-16 15:15:27.931+00	t	84	2.87
54	Sleek Frozen Bacon	Generic Bike designed with Rubber for powerless performance	605.29	HU2DY4OM	t	3	2025-01-16 15:15:28.286+00	2025-01-16 15:15:28.286+00	t	84	1.82
55	Tasty Wooden Ball	Introducing the Egypt-inspired Ball, blending crushing style with local craftsmanship	463.85	P3I5NPN1	t	3	2025-01-16 15:15:28.629+00	2025-01-16 15:15:28.629+00	t	84	4.69
56	Bespoke Cotton Gloves	Introducing the Croatia-inspired Chips, blending utter style with local craftsmanship	726.49	1DLPAPHY	t	3	2025-01-16 15:15:32.234+00	2025-01-16 15:15:32.234+00	t	37	1.18
57	Practical Steel Ball	Savor the delicious essence in our Ball, designed for hairy culinary adventures	11.99	UWK95JLO	t	3	2025-01-16 15:15:32.588+00	2025-01-16 15:15:32.588+00	t	37	2.59
58	Electronic Plastic Pants	Introducing the Israel-inspired Sausages, blending marvelous style with local craftsmanship	393.09	IEQ6JJMD	t	3	2025-01-16 15:15:32.955+00	2025-01-16 15:15:32.955+00	t	37	1.82
59	Generic Wooden Table	The Philip Fish is the latest in a series of oblong products from Yost - Conroy	874.05	1IBTTRJZ	t	3	2025-01-16 15:15:33.348+00	2025-01-16 15:15:33.348+00	t	37	4.07
60	Fantastic Bronze Chips	Ergonomic Car designed with Soft for indolent performance	395.55	XQJSGGNX	t	3	2025-01-16 15:15:33.702+00	2025-01-16 15:15:33.703+00	t	37	1.93
61	Licensed Rubber Shoes	Introducing the Dominica-inspired Hat, blending plain style with local craftsmanship	654.85	93JPBSQR	t	3	2025-01-16 15:15:34.064+00	2025-01-16 15:15:34.064+00	t	37	3.44
62	Generic Plastic Fish	Innovative Bacon featuring perky technology and Steel construction	707.39	2OMAXSFH	t	3	2025-01-16 15:15:34.403+00	2025-01-16 15:15:34.404+00	t	37	1.29
63	Oriental Rubber Chicken	Savor the fresh essence in our Soap, designed for superior culinary adventures	544.79	X4ASFLTM	t	3	2025-01-16 15:15:34.744+00	2025-01-16 15:15:34.744+00	t	37	2.56
64	Modern Wooden Tuna	Ergonomic Pants made with Fresh for all-day aggravating support	647.20	UZAVUZZN	t	3	2025-01-16 15:15:35.099+00	2025-01-16 15:15:35.1+00	t	37	4.15
65	Sleek Soft Gloves	Featuring Lithium-enhanced technology, our Tuna offers unparalleled outgoing performance	485.29	B4CL65S6	t	3	2025-01-16 15:15:35.471+00	2025-01-16 15:15:35.472+00	t	37	3.02
66	Bespoke Steel Shoes	Fantastic Pants designed with Frozen for whispered performance	630.09	BLIKJOGF	t	3	2025-01-16 15:15:35.816+00	2025-01-16 15:15:35.816+00	t	37	4.48
67	Fantastic Soft Towels	The sleek and equatorial Hat comes with azure LED lighting for smart functionality	533.95	LGDPUN8O	t	3	2025-01-16 15:15:36.152+00	2025-01-16 15:15:36.152+00	t	37	2.33
68	Unbranded Bronze Tuna	Our bitter-inspired Keyboard brings a taste of luxury to your raw lifestyle	537.79	TVCSF0ZS	t	3	2025-01-16 15:15:39.742+00	2025-01-16 15:15:39.742+00	t	76	4.34
69	Tasty Bronze Bike	The Arch Fish is the latest in a series of celebrated products from Hermiston Group	749.39	BAUYJDGQ	t	3	2025-01-16 15:15:40.1+00	2025-01-16 15:15:40.1+00	t	76	3.37
70	Modern Cotton Hat	Featuring Dysprosium-enhanced technology, our Pants offers unparalleled enlightened performance	652.54	I96UTH0R	t	3	2025-01-16 15:15:40.444+00	2025-01-16 15:15:40.444+00	t	76	2.00
71	Recycled Wooden Shoes	Refined Sausages designed with Wooden for hopeful performance	807.39	ID3VQEPE	t	3	2025-01-16 15:15:40.792+00	2025-01-16 15:15:40.792+00	t	76	2.58
72	Gorgeous Fresh Salad	The gold Table combines Iraq aesthetics with Aluminium-based durability	170.59	0SVLFMDS	t	3	2025-01-16 15:15:41.125+00	2025-01-16 15:15:41.125+00	t	76	1.67
73	Oriental Frozen Table	New indigo Chair with ergonomic design for right comfort	870.19	H7TGGQHS	t	3	2025-01-16 15:15:41.476+00	2025-01-16 15:15:41.476+00	t	76	1.70
74	Gorgeous Concrete Keyboard	Our horse-friendly Towels ensures apprehensive comfort for your pets	810.39	42H74SJI	t	3	2025-01-16 15:15:41.835+00	2025-01-16 15:15:41.835+00	t	76	3.43
75	Refined Wooden Ball	Innovative Shirt featuring imaginative technology and Plastic construction	75.25	OS2V9LKI	t	3	2025-01-16 15:15:42.194+00	2025-01-16 15:15:42.194+00	t	76	2.06
76	Electronic Fresh Computer	New silver Bike with ergonomic design for gigantic comfort	811.85	BJCVTG8A	t	3	2025-01-16 15:15:42.554+00	2025-01-16 15:15:42.554+00	t	76	3.81
77	Electronic Steel Shoes	Discover the bee-like agility of our Sausages, perfect for prudent users	711.89	WCWWE4DK	t	3	2025-01-16 15:15:42.886+00	2025-01-16 15:15:42.886+00	t	76	3.72
78	Intelligent Granite Cheese	New orchid Pants with ergonomic design for dearest comfort	425.25	XM3INVNJ	t	3	2025-01-16 15:15:43.234+00	2025-01-16 15:15:43.234+00	t	76	1.41
79	Awesome Plastic Tuna	Professional-grade Pants perfect for equatorial training and recreational use	36.55	C1AIY0T1	t	3	2025-01-16 15:15:43.576+00	2025-01-16 15:15:43.577+00	t	76	1.58
80	Small Plastic Salad	Ergonomic Car made with Plastic for all-day each support	35.45	2MODQURM	t	3	2025-01-16 15:15:43.938+00	2025-01-16 15:15:43.938+00	t	76	4.14
90	Refined Metal Bike	Savor the bitter essence in our Chicken, designed for optimal culinary adventures	960.69	1G0FOYKT	t	2	2025-01-16 15:50:45.884+00	2025-01-16 15:50:45.885+00	t	16	4.29
91	Refined Bronze Shirt	The Automated modular infrastructure Gloves offers reliable performance and esteemed design	399.49	9RYB4O0E	t	2	2025-01-16 15:50:46.277+00	2025-01-16 15:50:46.277+00	t	16	3.94
92	Gorgeous Plastic Shoes	Ergonomic Pants made with Soft for all-day rich support	689.49	DDJWTCK4	t	2	2025-01-16 15:50:46.63+00	2025-01-16 15:50:46.631+00	t	16	2.64
93	Refined Bronze Bacon	Stylish Ball designed to make you stand out with blaring looks	183.00	0DNZHWR0	t	2	2025-01-16 15:50:46.981+00	2025-01-16 15:50:46.981+00	t	16	2.58
94	Fantastic Steel Chicken	Leuschke - Kuhlman's most advanced Gloves technology increases aged capabilities	261.09	XJXHUUED	t	2	2025-01-16 15:50:47.337+00	2025-01-16 15:50:47.337+00	t	16	2.56
95	Awesome Steel Chair	Weimann, Schamberger and Sanford's most advanced Tuna technology increases shrill capabilities	480.79	LL9LJTRE	t	2	2025-01-16 15:50:47.694+00	2025-01-16 15:50:47.694+00	t	16	2.98
96	Fantastic Metal Ball	The Balanced full-range internet solution Chair offers reliable performance and posh design	451.05	HHKSYDCD	t	2	2025-01-16 15:50:48.066+00	2025-01-16 15:50:48.066+00	t	16	2.16
97	Generic Bronze Tuna	Ergonomic Mouse made with Cotton for all-day substantial support	976.69	2RGDSGMB	t	2	2025-01-16 15:50:48.43+00	2025-01-16 15:50:48.43+00	t	16	2.10
98	Oriental Wooden Ball	Featuring Erbium-enhanced technology, our Bike offers unparalleled scientific performance	821.09	E1ARBKVR	t	2	2025-01-16 15:50:48.769+00	2025-01-16 15:50:48.769+00	t	16	1.33
99	Rustic Cotton Bacon	Rustic Keyboard designed with Rubber for recent performance	535.10	0EQFELKB	t	2	2025-01-16 15:50:49.098+00	2025-01-16 15:50:49.098+00	t	16	2.84
100	Bespoke Plastic Sausages	Professional-grade Pants perfect for spanish training and recreational use	755.85	DH3EXFIH	t	2	2025-01-16 15:50:49.453+00	2025-01-16 15:50:49.453+00	t	16	3.04
101	Tasty Steel Shoes	Introducing the Sao Tome and Principe-inspired Shoes, blending frilly style with local craftsmanship	388.65	OZVRSNMK	t	2	2025-01-16 15:50:52.825+00	2025-01-16 15:50:52.825+00	t	17	2.27
107	Intelligent Metal Shoes	The green Chicken combines India aesthetics with Meitnerium-based durability	905.09	CDPWCU62	t	2	2025-01-16 15:50:54.928+00	2025-01-16 15:50:54.928+00	t	17	2.15
108	Handcrafted Rubber Car	Professional-grade Chair perfect for chubby training and recreational use	132.59	KEEYUDDG	t	2	2025-01-16 15:50:55.28+00	2025-01-16 15:50:55.281+00	t	17	4.92
109	Handcrafted Rubber Table	The white Cheese combines Sierra Leone aesthetics with Lithium-based durability	295.29	P0D4XL9A	t	2	2025-01-16 15:50:55.644+00	2025-01-16 15:50:55.644+00	t	17	4.97
110	Bespoke Wooden Fish	Experience the white brilliance of our Hat, perfect for burdensome environments	85.69	8AG6WXPW	t	2	2025-01-16 15:50:55.979+00	2025-01-16 15:50:55.979+00	t	17	1.51
111	Small Concrete Car	Discover the fox-like agility of our Hat, perfect for aged users	688.15	FYWFAO3K	t	2	2025-01-16 15:50:56.334+00	2025-01-16 15:50:56.334+00	t	17	3.37
112	Fantastic Plastic Shoes	The Total tangible analyzer Keyboard offers reliable performance and lone design	98.50	8JNYOTQY	t	2	2025-01-16 15:50:56.68+00	2025-01-16 15:50:56.68+00	t	17	3.90
113	Tasty Plastic Fish	New orchid Shoes with ergonomic design for long comfort	571.39	MRYEVCTA	t	2	2025-01-16 15:50:57.033+00	2025-01-16 15:50:57.033+00	t	17	3.27
114	Modern Steel Towels	Discover the wolf-like agility of our Tuna, perfect for other users	464.99	3ER0RBOE	t	2	2025-01-16 15:50:57.487+00	2025-01-16 15:50:57.488+00	t	17	4.88
115	Rustic Bronze Towels	Professional-grade Ball perfect for yellow training and recreational use	847.89	P046OV6F	t	2	2025-01-16 15:50:58.326+00	2025-01-16 15:50:58.326+00	t	17	1.40
116	Ergonomic Metal Pants	New sky blue Hat with ergonomic design for better comfort	276.25	BAGLIQ2I	t	2	2025-01-16 15:51:03.669+00	2025-01-16 15:51:03.669+00	t	75	1.87
117	Awesome Wooden Cheese	Introducing the Cook Islands-inspired Tuna, blending likely style with local craftsmanship	787.89	0MZYVWDL	t	2	2025-01-16 15:51:03.994+00	2025-01-16 15:51:03.994+00	t	75	4.87
118	Bespoke Wooden Table	Our frog-friendly Salad ensures optimistic comfort for your pets	217.85	A45LJ3UP	t	2	2025-01-16 15:51:04.341+00	2025-01-16 15:51:04.341+00	t	75	4.50
119	Ergonomic Cotton Chicken	Luxurious Pizza designed with Metal for exalted performance	378.32	NYE740TW	t	2	2025-01-16 15:51:04.678+00	2025-01-16 15:51:04.678+00	t	75	4.02
120	Recycled Plastic Chips	Our salty-inspired Hat brings a taste of luxury to your clean lifestyle	588.05	UEJKTVKT	t	2	2025-01-16 15:51:05.008+00	2025-01-16 15:51:05.008+00	t	75	4.23
121	Recycled Cotton Cheese	New pink Pants with ergonomic design for evil comfort	508.20	Y9ZFZFKC	t	2	2025-01-16 15:51:05.335+00	2025-01-16 15:51:05.335+00	t	75	1.45
122	Oriental Frozen Chair	Our whale-friendly Chips ensures early comfort for your pets	777.95	P5LGXJLP	t	2	2025-01-16 15:51:05.689+00	2025-01-16 15:51:05.69+00	t	75	3.43
123	Awesome Steel Bacon	Dach, Hahn and Rosenbaum's most advanced Keyboard technology increases unrealistic capabilities	230.97	SI1ILY1N	t	2	2025-01-16 15:51:06.043+00	2025-01-16 15:51:06.043+00	t	75	4.93
124	Intelligent Fresh Mouse	New Soap model with 91 GB RAM, 254 GB storage, and happy-go-lucky features	628.09	1PSLDAOP	t	2	2025-01-16 15:51:06.376+00	2025-01-16 15:51:06.377+00	t	75	2.27
125	Modern Frozen Chair	Stylish Gloves designed to make you stand out with worldly looks	224.29	GIWHJAP4	t	2	2025-01-16 15:51:06.703+00	2025-01-16 15:51:06.703+00	t	75	4.59
126	Ergonomic Fresh Salad	Our sour-inspired Chips brings a taste of luxury to your candid lifestyle	688.69	GOT6K3ZH	t	2	2025-01-16 15:51:07.06+00	2025-01-16 15:51:07.06+00	t	75	1.30
127	Awesome Wooden Bacon	Featuring Hydrogen-enhanced technology, our Soap offers unparalleled unfortunate performance	336.61	QQK1XE3B	t	2	2025-01-16 15:51:07.411+00	2025-01-16 15:51:07.411+00	t	75	1.69
128	Licensed Granite Computer	Ergonomic Shoes made with Plastic for all-day sociable support	758.99	PFVKTNV0	t	2	2025-01-16 15:51:07.769+00	2025-01-16 15:51:07.769+00	t	75	1.51
129	Intelligent Soft Ball	Discover the tight new Chips with an exciting mix of Bronze ingredients	572.20	ZFEW5PMO	t	2	2025-01-16 15:51:08.111+00	2025-01-16 15:51:08.111+00	t	75	3.63
130	Handmade Fresh Car	The Balanced dynamic portal Chair offers reliable performance and yummy design	461.19	TO042MLC	t	2	2025-01-16 15:51:12.16+00	2025-01-16 15:51:12.161+00	t	48	2.63
131	Rustic Wooden Keyboard	Stylish Sausages designed to make you stand out with secret looks	974.67	XNNABY5M	t	2	2025-01-16 15:51:12.542+00	2025-01-16 15:51:12.542+00	t	48	2.81
103	Generic Bronze Chicken	The Phased maximized firmware Pizza offers reliable performance and all design	243.48	AQUHUIXA	t	1	2025-01-16 15:50:53.532+00	2025-01-16 15:50:53.532+00	t	17	2.80
104	Ergonomic Wooden Salad	Savor the delicious essence in our Chips, designed for scaly culinary adventures	349.49	GORYNQ2J	t	1	2025-01-16 15:50:53.873+00	2025-01-16 15:50:53.874+00	t	17	1.31
105	Bespoke Wooden Gloves	Ergonomic Gloves made with Frozen for all-day querulous support	702.55	B81PBZTQ	t	1	2025-01-16 15:50:54.231+00	2025-01-16 15:50:54.231+00	t	17	3.60
106	Luxurious Plastic Shirt	Our rich-inspired Mouse brings a taste of luxury to your lively lifestyle	538.09	T3YY4CLC	t	1	2025-01-16 15:50:54.563+00	2025-01-16 15:50:54.563+00	t	17	1.89
132	Oriental Fresh Shirt	The Troy Computer is the latest in a series of damp products from Will and Sons	590.05	XVCM3RZF	t	2	2025-01-16 15:51:12.897+00	2025-01-16 15:51:12.897+00	t	48	4.07
133	Practical Fresh Shoes	Ergonomic Pizza made with Fresh for all-day optimal support	278.59	B8EB65D7	t	2	2025-01-16 15:51:13.256+00	2025-01-16 15:51:13.256+00	t	48	2.83
134	Practical Frozen Hat	Savor the creamy essence in our Pizza, designed for serpentine culinary adventures	545.30	GUZ9PSVR	t	2	2025-01-16 15:51:13.619+00	2025-01-16 15:51:13.619+00	t	48	1.58
135	Generic Granite Keyboard	Ergonomic Table made with Soft for all-day extra-large support	239.39	LR3JRZVZ	t	2	2025-01-16 15:51:13.969+00	2025-01-16 15:51:13.969+00	t	48	4.78
136	Tasty Frozen Tuna	Featuring Cerium-enhanced technology, our Pizza offers unparalleled artistic performance	32.99	ECR6952A	t	2	2025-01-16 15:51:14.333+00	2025-01-16 15:51:14.333+00	t	48	3.88
137	Fantastic Fresh Salad	New salmon Fish with ergonomic design for flashy comfort	589.05	0M6ATNLV	t	2	2025-01-16 15:51:14.673+00	2025-01-16 15:51:14.674+00	t	48	4.55
138	Electronic Plastic Bike	Featuring Thulium-enhanced technology, our Cheese offers unparalleled remarkable performance	459.25	1IZZ28IV	t	2	2025-01-16 15:51:15.034+00	2025-01-16 15:51:15.034+00	t	48	2.03
139	Recycled Rubber Fish	Discover the frog-like agility of our Pants, perfect for puzzled users	285.32	8PDS51XZ	t	2	2025-01-16 15:51:15.376+00	2025-01-16 15:51:15.376+00	t	48	2.17
140	Fantastic Metal Hat	Featuring Europium-enhanced technology, our Sausages offers unparalleled shimmering performance	702.19	6J2XMHBS	t	2	2025-01-16 15:51:15.712+00	2025-01-16 15:51:15.712+00	t	48	1.23
141	Recycled Cotton Chair	Stylish Chicken designed to make you stand out with flickering looks	922.89	3QW7PDSZ	t	2	2025-01-16 15:51:16.069+00	2025-01-16 15:51:16.069+00	t	48	3.95
142	Recycled Plastic Ball	Professional-grade Fish perfect for puzzled training and recreational use	320.79	XG5E5PPY	t	2	2025-01-16 15:51:16.404+00	2025-01-16 15:51:16.404+00	t	48	3.26
143	Rustic Wooden Shoes	Our savory-inspired Bacon brings a taste of luxury to your willing lifestyle	610.45	GJBV0JRC	t	2	2025-01-16 15:51:16.757+00	2025-01-16 15:51:16.757+00	t	48	3.20
144	Sleek Rubber Computer	Featuring Darmstadtium-enhanced technology, our Chair offers unparalleled squeaky performance	234.40	HIZ9O1IB	t	2	2025-01-16 15:51:17.1+00	2025-01-16 15:51:17.101+00	t	48	3.95
145	Awesome Metal Chicken	New cyan Car with ergonomic design for gruesome comfort	520.05	MOHWKJZF	t	3	2025-01-16 15:51:21.889+00	2025-01-16 15:51:21.89+00	t	81	1.09
146	Rustic Frozen Soap	Innovative Ball featuring wordy technology and Frozen construction	551.35	CKOPHGDK	t	3	2025-01-16 15:51:22.25+00	2025-01-16 15:51:22.251+00	t	81	2.27
147	Refined Cotton Pizza	Our tangy-inspired Computer brings a taste of luxury to your fearless lifestyle	57.15	DHVYLWPT	t	3	2025-01-16 15:51:22.595+00	2025-01-16 15:51:22.595+00	t	81	3.44
148	Oriental Steel Pizza	Gorgeous Shoes designed with Plastic for critical performance	571.69	TUUDT5NS	t	3	2025-01-16 15:51:22.96+00	2025-01-16 15:51:22.96+00	t	81	2.78
149	Rustic Plastic Chicken	Experience the pink brilliance of our Salad, perfect for spirited environments	620.79	L11Z1TVW	t	3	2025-01-16 15:51:23.316+00	2025-01-16 15:51:23.316+00	t	81	3.17
150	Tasty Metal Towels	Stylish Bacon designed to make you stand out with corrupt looks	769.99	CDUKACYZ	t	3	2025-01-16 15:51:23.676+00	2025-01-16 15:51:23.676+00	t	81	2.43
151	Refined Soft Pizza	Professional-grade Towels perfect for second training and recreational use	541.75	HPHIHSJB	t	3	2025-01-16 15:51:24.011+00	2025-01-16 15:51:24.011+00	t	81	4.25
152	Sleek Soft Fish	Innovative Mouse featuring astonishing technology and Cotton construction	751.15	IAOUFXFX	t	3	2025-01-16 15:51:24.332+00	2025-01-16 15:51:24.332+00	t	81	3.67
153	Small Bronze Computer	Discover the known new Hat with an exciting mix of Metal ingredients	403.45	3PEAD8HF	t	3	2025-01-16 15:51:24.683+00	2025-01-16 15:51:24.683+00	t	81	2.51
154	Practical Concrete Computer	New Keyboard model with 92 GB RAM, 368 GB storage, and joyful features	604.45	U30X2WXW	t	3	2025-01-16 15:51:25.028+00	2025-01-16 15:51:25.028+00	t	81	4.83
155	Luxurious Soft Ball	The Cross-platform asymmetric access Pants offers reliable performance and terrible design	827.55	P67S4DFT	t	3	2025-01-16 15:51:25.362+00	2025-01-16 15:51:25.362+00	t	81	3.05
156	Incredible Frozen Mouse	Generic Towels designed with Plastic for clueless performance	984.75	R3I9VKSO	t	3	2025-01-16 15:51:25.699+00	2025-01-16 15:51:25.699+00	t	81	2.40
157	Electronic Metal Towels	Savor the smoky essence in our Pants, designed for discrete culinary adventures	673.35	VTQKLHWN	t	3	2025-01-16 15:51:29.239+00	2025-01-16 15:51:29.24+00	t	81	1.24
158	Awesome Wooden Soap	Our flamingo-friendly Ball ensures excellent comfort for your pets	654.29	22LO5LYK	t	3	2025-01-16 15:51:29.564+00	2025-01-16 15:51:29.564+00	t	81	4.37
159	Unbranded Concrete Chicken	The sleek and teeming Shoes comes with cyan LED lighting for smart functionality	97.89	LAX4IMP7	t	3	2025-01-16 15:51:29.921+00	2025-01-16 15:51:29.921+00	t	81	3.49
160	Handcrafted Cotton Salad	The lime Shirt combines Mauritius aesthetics with Gallium-based durability	240.60	QFXJLSU7	t	3	2025-01-16 15:51:30.275+00	2025-01-16 15:51:30.275+00	t	81	4.28
161	Fantastic Fresh Pants	Experience the azure brilliance of our Table, perfect for another environments	536.09	LZZRZF1P	t	3	2025-01-16 15:51:30.611+00	2025-01-16 15:51:30.611+00	t	81	4.79
162	Modern Steel Mouse	Handcrafted Cheese designed with Metal for apt performance	116.19	BHS1GWVJ	t	3	2025-01-16 15:51:30.963+00	2025-01-16 15:51:30.963+00	t	81	1.40
163	Sleek Cotton Salad	Kautzer - Satterfield's most advanced Pants technology increases yellowish capabilities	533.95	W2ROW3CQ	t	3	2025-01-16 15:51:31.278+00	2025-01-16 15:51:31.278+00	t	81	2.96
164	Luxurious Fresh Car	Experience the orange brilliance of our Hat, perfect for evil environments	614.39	1Z0C3FMR	t	3	2025-01-16 15:51:31.653+00	2025-01-16 15:51:31.653+00	t	81	4.85
165	Intelligent Granite Towels	The Xander Soap is the latest in a series of zealous products from Adams - O'Keefe	814.89	7BR1GH2B	t	3	2025-01-16 15:51:31.996+00	2025-01-16 15:51:31.996+00	t	81	3.53
166	Luxurious Fresh Salad	Experience the ivory brilliance of our Fish, perfect for ripe environments	532.99	CUWDSGV8	t	3	2025-01-16 15:51:32.341+00	2025-01-16 15:51:32.341+00	t	81	4.40
167	Fantastic Soft Chair	Ergonomic Gloves made with Fresh for all-day subdued support	795.99	6VBDDUYV	t	3	2025-01-16 15:51:32.686+00	2025-01-16 15:51:32.686+00	t	81	3.67
168	Modern Concrete Gloves	Innovative Sausages featuring unconscious technology and Plastic construction	349.79	9ADU9QZV	t	3	2025-01-16 15:51:35.919+00	2025-01-16 15:51:35.919+00	t	1	3.52
169	Awesome Soft Chips	New Ball model with 17 GB RAM, 717 GB storage, and spiteful features	804.55	X7JUMOUC	t	3	2025-01-16 15:51:36.251+00	2025-01-16 15:51:36.251+00	t	1	2.63
170	Modern Fresh Computer	New Shirt model with 11 GB RAM, 224 GB storage, and judicious features	951.69	VC2D3VL1	t	3	2025-01-16 15:51:36.565+00	2025-01-16 15:51:36.565+00	t	1	2.41
171	Fantastic Frozen Salad	Experience the silver brilliance of our Bike, perfect for meager environments	498.45	CS0WXC4N	t	3	2025-01-16 15:51:36.923+00	2025-01-16 15:51:36.923+00	t	1	3.19
172	Tasty Concrete Ball	Ergonomic Pizza made with Fresh for all-day terrible support	132.69	KNSVND0U	t	3	2025-01-16 15:51:37.268+00	2025-01-16 15:51:37.268+00	t	1	2.28
173	Modern Concrete Shirt	Professional-grade Table perfect for slushy training and recreational use	303.19	FIAHERNJ	t	3	2025-01-16 15:51:37.62+00	2025-01-16 15:51:37.62+00	t	1	2.66
174	Awesome Bronze Shirt	Discover the turtle-like agility of our Shoes, perfect for experienced users	501.49	HYSSD3SP	t	3	2025-01-16 15:51:37.944+00	2025-01-16 15:51:37.944+00	t	1	4.32
175	Unbranded Cotton Fish	Experience the salmon brilliance of our Table, perfect for delirious environments	523.25	YANJ0UOQ	t	3	2025-01-16 15:51:38.299+00	2025-01-16 15:51:38.299+00	t	1	3.68
176	Fantastic Plastic Bacon	New Hat model with 34 GB RAM, 556 GB storage, and well-made features	593.09	P8TCR95C	t	3	2025-01-16 15:51:38.626+00	2025-01-16 15:51:38.626+00	t	1	4.95
177	Unbranded Cotton Salad	Savor the tangy essence in our Towels, designed for buzzing culinary adventures	416.99	P7O1HBLB	t	3	2025-01-16 15:51:41.352+00	2025-01-16 15:51:41.353+00	t	10	2.16
178	Bespoke Metal Mouse	The sleek and glaring Shoes comes with plum LED lighting for smart functionality	244.19	ZUFRU2UW	t	3	2025-01-16 15:51:41.698+00	2025-01-16 15:51:41.698+00	t	10	2.34
179	Gorgeous Soft Shirt	The Implemented zero defect task-force Table offers reliable performance and potable design	43.85	WYQD3OIB	t	3	2025-01-16 15:51:42.062+00	2025-01-16 15:51:42.063+00	t	10	3.41
180	Fantastic Plastic Table	Innovative Mouse featuring nifty technology and Steel construction	641.28	UU2FBEL3	t	3	2025-01-16 15:51:42.415+00	2025-01-16 15:51:42.416+00	t	10	3.43
181	Licensed Cotton Cheese	The Open-architected zero tolerance conglomeration Salad offers reliable performance and small design	181.95	GOLZIMRZ	t	3	2025-01-16 15:51:42.761+00	2025-01-16 15:51:42.761+00	t	10	4.56
182	Handmade Plastic Tuna	Savor the moist essence in our Chicken, designed for velvety culinary adventures	153.45	PPVWVJQN	t	4	2025-01-16 15:51:44.986+00	2025-01-16 15:51:44.987+00	t	32	3.11
183	Handmade Fresh Chair	The sleek and warlike Keyboard comes with ivory LED lighting for smart functionality	194.59	G1PDSJCK	t	4	2025-01-16 15:51:45.339+00	2025-01-16 15:51:45.339+00	t	32	4.46
184	Awesome Wooden Towels	New azure Bacon with ergonomic design for nice comfort	526.65	ZBTQGNLW	t	4	2025-01-16 15:51:45.665+00	2025-01-16 15:51:45.665+00	t	32	3.36
185	Oriental Cotton Chair	Stylish Computer designed to make you stand out with discrete looks	897.89	D9IPY3IT	t	4	2025-01-16 15:51:46.043+00	2025-01-16 15:51:46.043+00	t	32	4.02
186	Elegant Frozen Sausages	The sleek and focused Bike comes with blue LED lighting for smart functionality	310.04	OJV1HSDQ	t	4	2025-01-16 15:51:46.394+00	2025-01-16 15:51:46.394+00	t	32	1.83
187	Handcrafted Bronze Chair	New Keyboard model with 56 GB RAM, 130 GB storage, and stunning features	757.49	RBTJBOMB	t	4	2025-01-16 15:51:46.754+00	2025-01-16 15:51:46.754+00	t	32	3.83
188	Electronic Rubber Mouse	Introducing the North Macedonia-inspired Chips, blending blank style with local craftsmanship	255.15	DSQXGD3S	t	4	2025-01-16 15:51:47.129+00	2025-01-16 15:51:47.13+00	t	32	1.60
189	Practical Granite Car	Discover the fox-like agility of our Sausages, perfect for low users	231.39	YX6NLUFC	t	4	2025-01-16 15:51:47.504+00	2025-01-16 15:51:47.504+00	t	32	3.37
190	Tasty Frozen Pizza	Electronic Salad designed with Frozen for wretched performance	772.95	LPSFDKWM	t	4	2025-01-16 15:51:47.86+00	2025-01-16 15:51:47.86+00	t	32	3.36
191	Tasty Fresh Hat	Ergonomic Hat made with Concrete for all-day square support	515.39	7JAWG6YA	t	4	2025-01-16 15:51:48.246+00	2025-01-16 15:51:48.246+00	t	32	2.79
192	Generic Granite Cheese	The sleek and definite Fish comes with plum LED lighting for smart functionality	17.09	THOJ5FXO	t	4	2025-01-16 15:51:51.275+00	2025-01-16 15:51:51.275+00	t	82	1.02
193	Elegant Plastic Soap	Discover the yummy new Pizza with an exciting mix of Wooden ingredients	564.49	KPWR8IDK	t	4	2025-01-16 15:51:51.592+00	2025-01-16 15:51:51.592+00	t	82	1.92
194	Luxurious Soft Towels	Featuring Aluminium-enhanced technology, our Hat offers unparalleled striking performance	926.79	IW1NLABB	t	4	2025-01-16 15:51:51.957+00	2025-01-16 15:51:51.958+00	t	82	2.06
195	Handmade Soft Car	The Harmon Bike is the latest in a series of profitable products from Jacobi and Sons	404.85	YFC5R6MB	t	4	2025-01-16 15:51:52.31+00	2025-01-16 15:51:52.31+00	t	82	3.99
196	Handmade Metal Soap	The tan Tuna combines Belgium aesthetics with Cadmium-based durability	624.29	CZTW4XRA	t	4	2025-01-16 15:51:52.656+00	2025-01-16 15:51:52.656+00	t	82	4.94
197	Electronic Rubber Car	Experience the pink brilliance of our Pizza, perfect for actual environments	243.05	6RDXFCUM	t	4	2025-01-16 15:51:54.377+00	2025-01-16 15:51:54.377+00	t	84	1.31
198	Generic Soft Sausages	The salmon Ball combines Papua New Guinea aesthetics with Ytterbium-based durability	971.50	I2VZGWYS	t	4	2025-01-16 15:51:54.736+00	2025-01-16 15:51:54.736+00	t	84	2.98
199	Tasty Soft Table	Innovative Cheese featuring key technology and Frozen construction	354.85	LOOZT0TC	t	4	2025-01-16 15:51:55.097+00	2025-01-16 15:51:55.097+00	t	84	3.78
200	Practical Soft Towels	The gold Gloves combines Gibraltar aesthetics with Samarium-based durability	671.85	54MMAZQG	t	4	2025-01-16 15:51:55.431+00	2025-01-16 15:51:55.431+00	t	84	3.30
201	Bespoke Metal Soap	Stylish Sausages designed to make you stand out with bright looks	778.50	NBOZ1EWH	t	4	2025-01-16 15:51:55.775+00	2025-01-16 15:51:55.776+00	t	84	3.03
202	Tasty Steel Mouse	New Ball model with 8 GB RAM, 167 GB storage, and dirty features	454.69	FLUFRJSS	t	4	2025-01-16 15:51:56.107+00	2025-01-16 15:51:56.107+00	t	84	3.47
203	Handmade Rubber Mouse	Savor the fluffy essence in our Bike, designed for admired culinary adventures	593.59	RU9DLPIG	t	4	2025-01-16 15:51:56.454+00	2025-01-16 15:51:56.454+00	t	84	2.06
204	Small Concrete Salad	The Jeremie Ball is the latest in a series of youthful products from Carroll, Ward and Erdman	750.29	5QUEFHYX	t	4	2025-01-16 15:51:56.805+00	2025-01-16 15:51:56.805+00	t	84	1.83
205	Intelligent Rubber Chicken	New Tuna model with 38 GB RAM, 46 GB storage, and terrible features	946.45	WANIZORT	t	4	2025-01-16 15:51:57.144+00	2025-01-16 15:51:57.144+00	t	84	3.57
206	Licensed Bronze Shirt	Stylish Computer designed to make you stand out with warlike looks	812.89	I5C06GT2	t	4	2025-01-16 15:51:57.479+00	2025-01-16 15:51:57.479+00	t	84	1.47
207	Handmade Cotton Sausages	Professional-grade Cheese perfect for mixed training and recreational use	747.39	TNQIM6FU	t	4	2025-01-16 15:51:57.805+00	2025-01-16 15:51:57.805+00	t	84	2.72
208	Unbranded Steel Bacon	The Innovative responsive success Chicken offers reliable performance and spotless design	612.39	XUDBHAIG	t	4	2025-01-16 15:51:58.17+00	2025-01-16 15:51:58.17+00	t	84	3.59
209	Recycled Soft Chair	The Automated impactful moratorium Chair offers reliable performance and political design	411.69	93QRKORS	t	4	2025-01-16 15:51:58.514+00	2025-01-16 15:51:58.514+00	t	84	2.37
210	Elegant Plastic Shoes	Discover the whale-like agility of our Chicken, perfect for thin users	668.59	I24UAWIR	t	4	2025-01-16 15:52:02.324+00	2025-01-16 15:52:02.324+00	t	54	1.72
211	Electronic Bronze Mouse	Professional-grade Towels perfect for soulful training and recreational use	777.89	P1M3M2QR	t	4	2025-01-16 15:52:02.648+00	2025-01-16 15:52:02.649+00	t	54	4.59
212	Practical Granite Table	Introducing the Bulgaria-inspired Chips, blending juvenile style with local craftsmanship	907.35	6BPOBYHL	t	4	2025-01-16 15:52:02.983+00	2025-01-16 15:52:02.983+00	t	54	1.04
213	Sleek Steel Shirt	New ivory Towels with ergonomic design for gray comfort	181.95	WHA9P85P	t	4	2025-01-16 15:52:03.337+00	2025-01-16 15:52:03.337+00	t	54	1.34
214	Elegant Frozen Pants	Carroll, Cremin and Emmerich's most advanced Towels technology increases altruistic capabilities	704.55	VT6YR7RU	t	4	2025-01-16 15:52:03.662+00	2025-01-16 15:52:03.662+00	t	54	3.17
215	Modern Frozen Shirt	Small Hat designed with Granite for present performance	682.95	QZNEVIKW	t	4	2025-01-16 15:52:04.008+00	2025-01-16 15:52:04.009+00	t	54	2.66
216	Oriental Concrete Chair	New indigo Bacon with ergonomic design for fixed comfort	930.69	QBMLSSD6	t	5	2025-01-16 15:52:06.518+00	2025-01-16 15:52:06.518+00	t	24	2.42
217	Luxurious Soft Table	Ergonomic Cheese made with Metal for all-day prickly support	886.99	JLOWL2HA	t	5	2025-01-16 15:52:06.874+00	2025-01-16 15:52:06.874+00	t	24	4.47
218	Luxurious Concrete Car	Stylish Mouse designed to make you stand out with silky looks	944.09	APRZT3JA	t	5	2025-01-16 15:52:07.232+00	2025-01-16 15:52:07.232+00	t	24	1.81
219	Rustic Wooden Mouse	Featuring Nihonium-enhanced technology, our Chair offers unparalleled all performance	423.29	I8WSPNB1	t	5	2025-01-16 15:52:07.579+00	2025-01-16 15:52:07.579+00	t	24	1.34
220	Handcrafted Soft Gloves	Our fluffy-inspired Keyboard brings a taste of luxury to your assured lifestyle	851.38	QOEKPYSY	t	5	2025-01-16 15:52:07.908+00	2025-01-16 15:52:07.908+00	t	24	1.69
221	Gorgeous Bronze Gloves	Ergonomic Bacon made with Granite for all-day superb support	381.50	YICE6LHI	t	5	2025-01-16 15:52:08.245+00	2025-01-16 15:52:08.245+00	t	24	3.42
222	Handcrafted Soft Computer	Introducing the South Sudan-inspired Bacon, blending palatable style with local craftsmanship	167.59	OWRETH2T	t	5	2025-01-16 15:52:08.621+00	2025-01-16 15:52:08.621+00	t	24	3.08
223	Tasty Cotton Pants	Stylish Gloves designed to make you stand out with hasty looks	691.20	SOVR7LPR	t	5	2025-01-16 15:52:11.057+00	2025-01-16 15:52:11.057+00	t	70	1.76
224	Fantastic Fresh Ball	Tasty Pants designed with Metal for round performance	691.25	N39UTGPC	t	5	2025-01-16 15:52:11.381+00	2025-01-16 15:52:11.381+00	t	70	2.29
225	Awesome Concrete Chicken	Innovative Mouse featuring scratchy technology and Bronze construction	180.79	HNDZCMNK	t	5	2025-01-16 15:52:11.706+00	2025-01-16 15:52:11.707+00	t	70	2.38
226	Licensed Soft Shoes	The green Bike combines Saint Barthelemy aesthetics with Bromine-based durability	226.19	NPEOJ4D6	t	5	2025-01-16 15:52:12.055+00	2025-01-16 15:52:12.055+00	t	70	2.48
227	Fantastic Fresh Soap	Block, Auer and Boyle's most advanced Chips technology increases merry capabilities	413.99	M8QQDKGI	t	5	2025-01-16 15:52:12.387+00	2025-01-16 15:52:12.387+00	t	70	4.56
228	Handcrafted Steel Mouse	Savor the fluffy essence in our Towels, designed for sentimental culinary adventures	576.09	FFXIVBWT	t	5	2025-01-16 15:52:14.129+00	2025-01-16 15:52:14.13+00	t	70	3.39
229	Recycled Rubber Cheese	Professional-grade Shoes perfect for regular training and recreational use	152.50	WMRGLL5F	t	5	2025-01-16 15:52:14.478+00	2025-01-16 15:52:14.478+00	t	70	2.50
230	Bespoke Rubber Salad	Discover the rhinoceros-like agility of our Fish, perfect for digital users	533.45	KMC95WAV	t	5	2025-01-16 15:52:14.856+00	2025-01-16 15:52:14.856+00	t	70	4.27
231	Small Cotton Pants	Savor the tender essence in our Car, designed for lone culinary adventures	905.90	PUKLIDIP	t	5	2025-01-16 15:52:15.172+00	2025-01-16 15:52:15.172+00	t	70	4.85
232	Practical Frozen Soap	Savor the fluffy essence in our Table, designed for recent culinary adventures	950.39	7NJJLBYY	t	5	2025-01-16 15:52:15.51+00	2025-01-16 15:52:15.51+00	t	70	2.04
233	Electronic Bronze Sausages	The User-centric high-level matrices Cheese offers reliable performance and webbed design	583.59	LAJRZKTX	t	5	2025-01-16 15:52:15.835+00	2025-01-16 15:52:15.835+00	t	70	2.90
234	Oriental Plastic Ball	Professional-grade Shoes perfect for nocturnal training and recreational use	723.00	5HMYGS4T	t	5	2025-01-16 15:52:16.169+00	2025-01-16 15:52:16.169+00	t	70	4.83
235	Intelligent Soft Bike	Our frog-friendly Bike ensures flowery comfort for your pets	661.85	3WQGFSIQ	t	5	2025-01-16 15:52:16.504+00	2025-01-16 15:52:16.504+00	t	70	1.55
236	Licensed Cotton Bike	Rustic Pants designed with Frozen for trustworthy performance	413.99	X7KFO8RT	t	5	2025-01-16 15:52:16.859+00	2025-01-16 15:52:16.859+00	t	70	3.31
237	Gorgeous Steel Sausages	Savor the bitter essence in our Chair, designed for impressive culinary adventures	1.70	LNNOZUY6	t	5	2025-01-16 15:52:17.215+00	2025-01-16 15:52:17.215+00	t	70	4.31
238	Tasty Rubber Chicken	Discover the warped new Tuna with an exciting mix of Wooden ingredients	42.10	STGHABCA	t	5	2025-01-16 15:52:17.547+00	2025-01-16 15:52:17.547+00	t	70	3.76
239	Sleek Rubber Chicken	Friesen - Monahan's most advanced Keyboard technology increases upbeat capabilities	912.39	HSRJYVSL	t	5	2025-01-16 15:52:17.9+00	2025-01-16 15:52:17.9+00	t	70	2.14
240	Practical Wooden Ball	Discover the bird-like agility of our Ball, perfect for homely users	57.79	JH4JWCLR	t	5	2025-01-16 15:52:21.337+00	2025-01-16 15:52:21.337+00	t	69	3.22
241	Awesome Plastic Computer	Introducing the Anguilla-inspired Cheese, blending some style with local craftsmanship	74.65	QMBW2F9S	t	5	2025-01-16 15:52:21.654+00	2025-01-16 15:52:21.654+00	t	69	4.35
242	Tasty Granite Shirt	Featuring Caesium-enhanced technology, our Fish offers unparalleled long-term performance	852.79	USGMYMVH	t	5	2025-01-16 15:52:21.996+00	2025-01-16 15:52:21.996+00	t	69	3.98
243	Handcrafted Concrete Computer	Weissnat - Labadie's most advanced Bike technology increases fortunate capabilities	553.35	WMLSCUSK	t	5	2025-01-16 15:52:22.351+00	2025-01-16 15:52:22.351+00	t	69	4.57
244	Oriental Steel Car	Experience the ivory brilliance of our Pants, perfect for posh environments	37.29	473KSCTC	t	5	2025-01-16 15:52:22.687+00	2025-01-16 15:52:22.688+00	t	69	1.54
245	Awesome Fresh Car	Our sour-inspired Sausages brings a taste of luxury to your hoarse lifestyle	702.27	6V5UOUPB	t	5	2025-01-16 15:52:23.02+00	2025-01-16 15:52:23.02+00	t	69	4.87
246	Awesome Rubber Chair	Discover the frog-like agility of our Mouse, perfect for frail users	986.95	TATAWTYG	t	5	2025-01-16 15:52:23.344+00	2025-01-16 15:52:23.344+00	t	69	3.02
247	Unbranded Frozen Pants	The Profit-focused systematic standardization Fish offers reliable performance and moral design	39.19	V8GIYAPZ	t	5	2025-01-16 15:52:23.671+00	2025-01-16 15:52:23.671+00	t	69	1.48
102	Tasty Plastic Mouse	Savor the tender essence in our Bike, designed for authorized culinary adventures	952.59	VREOTGRL	t	1	2025-01-16 15:50:53.175+00	2025-01-16 15:50:53.175+00	t	17	1.95
\.


--
-- Data for Name: resources; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.resources (id, name, description, is_active, available_actions, tenant_id, created_at, updated_at) FROM stdin;
1	tenants	Resource for tenants	t	["create"]	\N	2025-02-20 15:18:43.732+00	2025-02-20 15:18:43.733+00
3	dashboard	Dashboard access and widgets	t	["create","read","update","delete"]	\N	2025-02-25 11:10:26.989656+00	2025-02-25 11:10:26.989656+00
4	orders	Order processing and tracking	t	["create","read","update","delete"]	\N	2025-02-25 11:10:26.989656+00	2025-02-25 11:10:26.989656+00
5	permissions	Permission configuration	t	["create","read","update","delete"]	\N	2025-02-25 11:10:26.989656+00	2025-02-25 11:10:26.989656+00
6	products	Product catalog management	t	["create","read","update","delete"]	\N	2025-02-25 11:10:26.989656+00	2025-02-25 11:10:26.989656+00
7	roles	Role management and assignment	t	["create","read","update","delete"]	\N	2025-02-25 11:10:26.989656+00	2025-02-25 11:10:26.989656+00
8	tenants	tenants management	t	["create","read","update","delete"]	\N	2025-02-25 11:10:26.989656+00	2025-02-25 11:10:26.989656+00
9	users	User management system	t	["create","read","update","delete"]	\N	2025-02-25 11:10:26.989656+00	2025-02-25 11:10:26.989656+00
10	deliveries	Resource for managing deliveries	t	["create", "read", "update", "delete"]	\N	2025-02-25 11:12:26.157576+00	2025-02-25 11:12:26.157576+00
12	resources	Resource for resources management	t	["read","create","update","delete"]	\N	2025-02-20 15:18:43.732+00	2025-02-20 15:18:43.732+00
13	menus	Menu resource for resource management	t	["read","update","delete","create"]	1	2025-02-28 11:35:29.047+00	2025-02-28 11:35:29.047+00
\.


--
-- Data for Name: role_permission; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.role_permission (id, role_id, permission_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	1	5
6	1	6
7	1	7
8	1	8
9	1	9
10	1	10
11	1	11
12	1	12
13	1	13
14	1	14
15	1	15
16	1	16
17	1	17
18	1	18
19	1	19
20	1	20
21	1	21
22	1	22
23	1	23
24	1	24
25	1	25
26	1	26
27	1	27
29	1	29
30	2	2
31	2	6
32	2	10
33	2	14
34	2	18
35	2	22
36	2	25
37	2	27
38	3	2
39	3	6
40	3	10
41	3	14
42	3	18
43	3	22
44	3	25
45	3	27
46	4	2
47	4	6
48	4	10
49	4	14
50	4	18
51	4	22
52	4	25
53	4	27
54	3	11
55	5	10
56	5	11
57	1	31
58	5	33
59	5	34
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.roles (id, name, tenant_id, created_at, updated_at) FROM stdin;
1	super-admin	\N	2025-01-16 15:01:33.801+00	2025-01-16 15:01:33.802+00
2	admin	\N	2025-01-16 15:01:33.932+00	2025-01-16 15:01:33.932+00
3	user	\N	2025-01-16 15:01:34.017+00	2025-01-16 15:01:34.018+00
4	manager	\N	2025-01-16 15:01:34.106+00	2025-01-16 15:01:34.107+00
5	delivery-person	1	2025-02-10 10:14:10.87+00	2025-02-28 11:30:23.761+00
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.tenants (id, slug, name, domain, description, status, rating, logo, cover_image, product_count, is_featured, created_at, updated_at) FROM stdin;
6	dicki-fadel-and-champlin-oZrv1g3z	Sawayn and Sons	inferior-bump.com	Persevering resilient forecast	active	0.0	\N	\N	0	f	2025-01-16 15:06:18.123+00	2025-01-16 15:06:18.124+00
7	gleichner-inc-YFeaauEe	Denesik - Collier	moist-tarragon.net	Adaptive eco-centric generative AI	active	0.0	\N	\N	0	f	2025-01-16 15:06:18.88+00	2025-01-16 15:06:18.88+00
8	hartmann-inc-vURFyqn5	Wuckert - Dietrich	unique-trench.biz	Virtual directional data-warehouse	active	0.0	\N	\N	0	f	2025-01-16 15:06:19.532+00	2025-01-16 15:06:19.532+00
9	boyer-corwin-and-lowe-9rydwOas	Robel Group	busy-fledgling.com	Self-enabling uniform framework	active	0.0	\N	\N	0	f	2025-01-16 15:06:20.217+00	2025-01-16 15:06:20.217+00
10	bradtke-steuber-and-gutmann-3XaqeMQ4	Wunsch - Krajcik	competent-brook.org	Managed high-level toolset	active	0.0	\N	\N	0	f	2025-01-16 15:06:20.907+00	2025-01-16 15:06:20.907+00
11	funk---quitzon-LWVikFxu	Price, Effertz and Douglas	mundane-giant.com	Devolved tangible artificial intelligence	active	0.0	\N	\N	0	f	2025-01-16 15:06:21.605+00	2025-01-16 15:06:21.605+00
12	robel-llc-gHMvs60H	Denesik - Conroy	standard-settler.net	Networked tertiary paradigm	active	0.0	\N	\N	0	f	2025-01-16 15:06:22.264+00	2025-01-16 15:06:22.264+00
13	bednar-rath-and-wolff-MiBF9Ahj	Bernhard - Hane	sinful-technician.org	Devolved maximized customer loyalty	active	0.0	\N	\N	0	f	2025-01-16 15:06:22.894+00	2025-01-16 15:06:22.894+00
14	zboncak---bailey-rQjGInEa	Raynor - Keeling	apt-zebra.net	Total neutral challenge	active	0.0	\N	\N	0	f	2025-01-16 15:06:23.615+00	2025-01-16 15:06:23.615+00
15	heathcote-boyle-and-nader-o39aVZnq	Legros - Ratke	lucky-flat.net	Profit-focused impactful utilisation	active	0.0	\N	\N	0	f	2025-01-16 15:06:24.312+00	2025-01-16 15:06:24.312+00
1	default	Default tenant	default.market.com	The marketplace that you should know	active	5.0	\N	\N	0	t	2025-01-16 15:04:05.398+00	2025-01-16 15:04:05.401+00
3	fashion-square	Fashion Square	fashion.marketplace.com	Trendy fashion and accessories	active	4.7	https://images.unsplash.com/photo-1515886657613-9f3515b0c78f	https://images.unsplash.com/photo-1490481651871-ab68de25d43d	0	t	2025-01-16 15:04:09.107+00	2025-01-16 15:04:09.108+00
2	electronics-hub	Electronics Hub	electronics.marketplace.com	Latest electronics and gadgets	active	4.5	https://images.unsplash.com/photo-1498049794561-7780e7231661	https://images.unsplash.com/photo-1550009158-9ebf69173e03	0	t	2025-01-16 15:04:07.967+00	2025-01-16 15:04:07.967+00
4	home-living	Home & Living	home.marketplace.com	Everything for your home	active	4.3	https://images.unsplash.com/photo-1484154218962-a197022b5858	https://images.unsplash.com/photo-1512917774080-9991f1c4c750	0	t	2025-01-16 15:04:10.159+00	2025-01-16 15:04:10.16+00
5	sports-center	Sports Center	sports.marketplace.com	Sports gear and equipment	active	4.6	https://images.unsplash.com/photo-1517649763962-0c623066013b	https://images.unsplash.com/photo-1461896836934-ffe607ba8211	0	t	2025-01-16 15:04:11.824+00	2025-01-16 15:04:11.824+00
\.


--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.user_profiles (id, user_id, bio, phone, avatar_url, website, created_at, updated_at) FROM stdin;
1	16	gfffffffff		\N		2025-02-07 13:12:04.179+00	2025-02-10 10:26:22.306+00
2	19	\N	\N	\N	\N	2025-02-10 10:34:21.111+00	2025-02-10 10:34:21.111+00
4	21	\N	\N	\N	\N	2025-02-10 11:06:31.609+00	2025-02-10 11:06:31.609+00
5	26	\N	\N	\N	\N	2025-03-03 14:13:04.062+00	2025-03-03 14:13:04.062+00
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.user_roles (id, user_id, role_id, created_at, updated_at) FROM stdin;
1	1	2	2025-01-16 15:04:07.661374+00	2025-01-16 15:04:07.661374+00
2	2	2	2025-01-16 15:04:08.803415+00	2025-01-16 15:04:08.803415+00
3	3	2	2025-01-16 15:04:09.857001+00	2025-01-16 15:04:09.857001+00
4	4	2	2025-01-16 15:04:11.521131+00	2025-01-16 15:04:11.521131+00
5	5	2	2025-01-16 15:04:12.702458+00	2025-01-16 15:04:12.702458+00
6	6	1	2025-01-16 15:06:24.887699+00	2025-01-16 15:06:24.887699+00
7	7	4	2025-01-16 15:06:24.907218+00	2025-01-16 15:06:24.907218+00
8	9	3	2025-01-16 15:06:24.916743+00	2025-01-16 15:06:24.916743+00
9	8	3	2025-01-16 15:06:24.918014+00	2025-01-16 15:06:24.918014+00
10	10	3	2025-01-16 15:06:24.918926+00	2025-01-16 15:06:24.918926+00
11	12	3	2025-01-16 15:06:24.936636+00	2025-01-16 15:06:24.936636+00
12	11	3	2025-01-16 15:06:24.946488+00	2025-01-16 15:06:24.946488+00
13	13	3	2025-01-16 15:06:24.95639+00	2025-01-16 15:06:24.95639+00
14	15	3	2025-01-16 15:06:24.976295+00	2025-01-16 15:06:24.976295+00
15	14	3	2025-01-16 15:06:24.976484+00	2025-01-16 15:06:24.976484+00
16	16	1	2025-01-16 16:15:58.072001+00	2025-01-16 16:15:58.072001+00
19	16	2	2025-01-29 12:39:52.941404+00	2025-01-29 12:39:52.941404+00
20	19	5	2025-02-10 10:34:21.586993+00	2025-02-10 10:34:21.586993+00
22	21	5	2025-02-10 11:06:32.025076+00	2025-02-10 11:06:32.025076+00
23	26	5	2025-03-03 14:13:03.854367+00	2025-03-03 14:13:03.854367+00
24	17	2	2025-03-04 12:56:32.601866+00	2025-03-04 12:56:32.601866+00
\.


--
-- Data for Name: user_tenants; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.user_tenants (id, user_id, tenant_id, created_at, updated_at) FROM stdin;
1	6	6	2025-01-16 15:06:17.207425+00	2025-01-16 15:06:17.207425+00
2	7	7	2025-01-16 15:06:17.207425+00	2025-01-16 15:06:17.207425+00
3	8	8	2025-01-16 15:06:17.207425+00	2025-01-16 15:06:17.207425+00
4	9	9	2025-01-16 15:06:17.207425+00	2025-01-16 15:06:17.207425+00
5	10	10	2025-01-16 15:06:17.207425+00	2025-01-16 15:06:17.207425+00
6	11	11	2025-01-16 15:06:17.207425+00	2025-01-16 15:06:17.207425+00
7	12	12	2025-01-16 15:06:17.207425+00	2025-01-16 15:06:17.207425+00
8	13	13	2025-01-16 15:06:17.207425+00	2025-01-16 15:06:17.207425+00
9	14	14	2025-01-16 15:06:17.207425+00	2025-01-16 15:06:17.207425+00
10	15	15	2025-01-16 15:06:17.207425+00	2025-01-16 15:06:17.207425+00
11	6	1	2025-01-16 15:06:24.348463+00	2025-01-16 15:06:24.348463+00
12	7	1	2025-01-16 15:06:24.434578+00	2025-01-16 15:06:24.434578+00
13	8	1	2025-01-16 15:06:24.542731+00	2025-01-16 15:06:24.542731+00
14	9	1	2025-01-16 15:06:24.661514+00	2025-01-16 15:06:24.661514+00
15	10	1	2025-01-16 15:06:24.778808+00	2025-01-16 15:06:24.778808+00
17	12	1	2025-01-16 15:06:24.858735+00	2025-01-16 15:06:24.858735+00
16	11	1	2025-01-16 15:06:24.857272+00	2025-01-16 15:06:24.857272+00
18	13	1	2025-01-16 15:06:24.867818+00	2025-01-16 15:06:24.867818+00
19	15	1	2025-01-16 15:06:24.887417+00	2025-01-16 15:06:24.887417+00
20	14	1	2025-01-16 15:06:24.887235+00	2025-01-16 15:06:24.887235+00
21	16	1	2025-01-16 16:15:57.797003+00	2025-01-16 16:15:57.797003+00
22	17	1	2025-01-27 11:33:55.172866+00	2025-01-27 11:33:55.172866+00
23	18	1	2025-02-04 12:14:49.08642+00	2025-02-04 12:14:49.08642+00
24	19	1	2025-02-10 10:34:21.301529+00	2025-02-10 10:34:21.301529+00
26	21	1	2025-02-10 11:06:31.769648+00	2025-02-10 11:06:31.769648+00
27	26	1	2025-03-03 14:13:03.618103+00	2025-03-03 14:13:03.618103+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.users (id, username, email, first_name, last_name, password, status, last_login_at, created_at, updated_at) FROM stdin;
1	admin_default	admin@default.market.com	Store	Admin	$scrypt$n=16384,r=8,p=1$AmknlrWcDdXS5tbhq2VeMA$33Wo7WlAvug5wQKVtnCscZrITNPISRq5PbmyCEoPlhVhJ2d3okWq5xh2oaOC6lnNpub5wJeNNn94YaaY2z3W9w	active	\N	2025-01-16 15:04:07.675+00	2025-01-16 15:04:07.676+00
2	admin_electronics-hub	admin@electronics.marketplace.com	Store	Admin	$scrypt$n=16384,r=8,p=1$fBuisNKjIx3zhMBXPsfT4A$5rduOjc/d2Fe1If+j4eqVQpHBvHSCfhLUpxgv6WPuUuSju1aVNB9Cs3+iY+noOyQfWgnW8fkgZp0Xk63GVhL1Q	active	\N	2025-01-16 15:04:08.837+00	2025-01-16 15:04:08.839+00
3	admin_fashion-square	admin@fashion.marketplace.com	Store	Admin	$scrypt$n=16384,r=8,p=1$QFYu1/QD7jqN5dN7Bgy9/A$ghtEnXT09NSmKEmkYpTySMvBqbm3aD0NqZkWYfo7EZD+aPS/8KvCyLRTANbAETtTt6rVPHW3re23CYmVuLMtvw	active	\N	2025-01-16 15:04:09.901+00	2025-01-16 15:04:09.901+00
4	admin_home-living	admin@home.marketplace.com	Store	Admin	$scrypt$n=16384,r=8,p=1$NNX9JiIIaHu4pxnXNHFUEw$k9e2hv7ksMKSg1MOx0a2G8E44JITDaJ7twP/Su05neQDiPOuYoAYGwDP/Nb4rJhvDXWpUbW/Ut5/EN3Om7Qiyw	active	\N	2025-01-16 15:04:11.568+00	2025-01-16 15:04:11.568+00
5	admin_sports-center	admin@sports.marketplace.com	Store	Admin	$scrypt$n=16384,r=8,p=1$ARPNLCFWihMVKhV086ckDA$if9ae/ItZIubJSycxv1Nrl1TPKSVfFavNn1uIeB1/0Y4eVh9xV0s7JvV1A2DpCsghVAlcFWPR1VXFtQsi48YPQ	active	\N	2025-01-16 15:04:12.768+00	2025-01-16 15:04:12.768+00
6	Marco9	Archibald_Jast@hotmail.com	Glennie	Rath	$scrypt$n=16384,r=8,p=1$Jh/nXuNf7NWg7GPA7AqdNg$bNaoYiGjg94vItYWOFbC4iSinSMdt56XK2amsRens+RDC2sr/XWJf5neLs6LyckPlsfahs56NDClXOJgOn7Gng	active	\N	2025-01-16 15:06:17.76+00	2025-01-16 15:06:17.761+00
7	Lee_Haag	Erin55@gmail.com	Nola	Keebler	$scrypt$n=16384,r=8,p=1$CE8MyNmh0KQqgNd0k1b+kQ$WZjPxTqXDoJAUO5mqezvQCXydA9Y+Rx+lUmsdwsW8BQmZCfEcvfDTEn4DFMLns97m1Wuau83YbMtBfcz2VIt4g	active	\N	2025-01-16 15:06:18.551+00	2025-01-16 15:06:18.551+00
8	Peggie.Heller98	Andre_Fay49@gmail.com	Dewitt	Reynolds-Buckridge	$scrypt$n=16384,r=8,p=1$hhN6+3yBl/xN4ChDqtnWZA$4Ibs7SsZL2MrwPqh/SmxR9QICo2boGLVu9cRaoVgD8V0xbxFVk1f1eYyzEHC/C/YAu/cxZRVlMCjbERA/MWSeQ	active	\N	2025-01-16 15:06:19.241+00	2025-01-16 15:06:19.241+00
9	Sigurd.Becker69	Jovani97@yahoo.com	Cecelia	Prohaska	$scrypt$n=16384,r=8,p=1$+z5JMZbRsS4hGBotp3UQgQ$AcGLHOfP9EVHrVLEN+q65Gu25NVUXRAxcbMpfJ1hJlowpDskNEKMRyLfhO10o4McF9peonOnxONqqnI9q4Cizw	active	\N	2025-01-16 15:06:19.909+00	2025-01-16 15:06:19.909+00
10	Jonathan76	Marilou12@gmail.com	Keith	Tromp	$scrypt$n=16384,r=8,p=1$a1vaU+EuSsVkeQ1oQtDG+A$JZ1VZlxug4wTtgUiOaIx6AU6JdMRV2dWeQ1hNRCwKoycIuApI6SeR8re6rKsEQZQdcHav/29k1LmIc8zJEpJDg	active	\N	2025-01-16 15:06:20.613+00	2025-01-16 15:06:20.613+00
11	Daphne_Heaney-Cronin71	Taryn.Hand-Mills@gmail.com	Emory	Hilpert	$scrypt$n=16384,r=8,p=1$t4bMZLd687hvMQ5y354vfw$ITGCGFLIzGa08NbRnuifgxdX1j8gT9HfhMM0dhLDx7Nd98UBkM8+YLZOjioP8xsyy2dmKOlEqAtLD/BUu0sbMw	active	\N	2025-01-16 15:06:21.263+00	2025-01-16 15:06:21.263+00
12	Tyrell99	Dario.Torphy@hotmail.com	Ruthe	Smith	$scrypt$n=16384,r=8,p=1$0WejfxfzleT6mv4IzO4XQQ$QSNvbn8tDdYF8ElJ2jtF6iY8JKPtujWhA7oC6pWhM1wvKjs9BV5DKcX+CwmFY15ID0BpuIwM+fIsmNTl4n4s4g	active	\N	2025-01-16 15:06:22.006+00	2025-01-16 15:06:22.006+00
13	Lester_Bednar82	Lazaro_DuBuque@gmail.com	Michelle	O'Connell	$scrypt$n=16384,r=8,p=1$61PIdPPLSC/bwbqkO0m2Mg$Q84aecayy8abMMqOgRzItgljgIIMvNfarWP5uMsz97MUouHyoK0hpjB0/Ji4LiTCuGpHBK407uWB08PR6RoOvg	active	\N	2025-01-16 15:06:22.63+00	2025-01-16 15:06:22.63+00
14	Kianna78	Armand_Homenick75@gmail.com	Edwina	Kassulke	$scrypt$n=16384,r=8,p=1$66augBOgffHQOxvRiuIL8w$IVoeRegEXHe5tCKluUXOHWUqAUg4lpZHykn8Zw53jyKFGLXMwk7IPmKAvx+z13Rpc5mbDe8SQ5Dw6f4ieCsiLQ	active	\N	2025-01-16 15:06:23.285+00	2025-01-16 15:06:23.285+00
15	Adaline94	Scotty56@gmail.com	Aimee	Block	$scrypt$n=16384,r=8,p=1$tGwpPuu+K5dCNrou/FElRw$isOCX6SHBgj/ewQdLe3BkxKadBEoNQqQ1/UfiqcqVnVJCiuZ9KltamKZZnsmWJRTuOUqrUsNT6ayj6iwLp7v+A	active	\N	2025-01-16 15:06:24.019+00	2025-01-16 15:06:24.019+00
19	atedoe	touguearistide.ate@ucad.edu.sn	John	Ate	$scrypt$n=16384,r=8,p=1$iCF5t0gVtVvLXa0envHjnA$OVFLUsPc+NWI8VxtX8C2muh+uAgv3g/ax1bgIftlKeB1MsknJzijKxyEj47t5J0LfJXV77BKOL8tPhxVllbvuQ	active	\N	2025-02-10 10:34:20.894+00	2025-02-10 10:34:20.894+00
17	aristide	touguearistideate@esp.sn	Até Tougué	Aristide	$scrypt$n=16384,r=8,p=1$puiQ84EUjm8YKLAG6a/x6g$Z77sFAlN2fBEzXqjRUTMYEqky4prA0TBC2kfzXETM9KCGgpYd3fUzZCWR+sHjn1da09QlhQxrTc6v74ImoJ7nQ	active	2025-03-04 12:56:56.931+00	2025-01-27 11:33:53.364+00	2025-03-04 12:56:56.931+00
16	atetheone	atevirran@gmail.com	Aristide	Até Tougué	$scrypt$n=16384,r=8,p=1$X1y0MRbR7JxI/Qb/C7F/aw$9JKSVUGLWO6EFwR3VgpCTNoC2Hpm1RsbROyejZ/1WO+VG/Lb5A9eq67pToH3VIZNYb+6qP3tVmH94jGp4U3YhQ	active	2025-03-05 08:40:47.681+00	2025-01-16 16:15:57.836+00	2025-03-05 08:40:47.682+00
21	gringa	gringasamuel1@gmail.com	Gringa	Sam	$scrypt$n=16384,r=8,p=1$LMegbHmcBVs0iFx6AmFE6Q$jsGUM27I541UE4vQ88uHMTChpHHEF1n+ZmH+LbicCI5PXEFcG8cos/RMRITG7FXde7mklp7ucMxs8gZh1RqteA	active	2025-02-10 11:09:17.614+00	2025-02-10 11:06:31.432+00	2025-02-10 11:09:17.614+00
18	erastera	tougue-aristide.ate@epita.fr	TOUGUE	ATE	$scrypt$n=16384,r=8,p=1$VPMPPsHCbGO+pxwO99dAKA$544+Qp1S17E+6hiRAs1cjuBnS6u6tbcvO1ZaaPIjo5Ir+07eeuy+0lFUGMlTQcEatfZddJ3mHghqAPrJ/7g0yQ	pending	\N	2025-02-04 12:14:49.046+00	2025-02-04 12:14:49.047+00
26	atomicc	example@email.com	TOUGUE	ATE	$scrypt$n=16384,r=8,p=1$Ua29RjmGxvwGPgOwtoD9zA$iiDZfmKp49sNbWt1iPxaQsePKIRerjUzy4gFxQ+HmEeVXv16OFI+DAk8fGxE5EBBmoXXSLmKjEdCLg73Q1E26A	pending	\N	2025-03-03 14:13:03.891+00	2025-03-03 14:13:03.891+00
\.


--
-- Data for Name: users_addresses; Type: TABLE DATA; Schema: public; Owner: jefjel_owner
--

COPY public.users_addresses (id, user_id, address_id, created_at, updated_at) FROM stdin;
1	16	1	2025-01-17 15:08:00.526739+00	2025-01-17 15:08:00.526739+00
2	16	2	2025-01-20 12:30:20.727682+00	2025-01-20 12:30:20.727682+00
\.


--
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.addresses_id_seq', 2, true);


--
-- Name: adonis_schema_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.adonis_schema_id_seq', 116, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 39, true);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.carts_id_seq', 20, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.categories_id_seq', 25, true);


--
-- Name: category_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.category_products_id_seq', 1, false);


--
-- Name: deliveries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.deliveries_id_seq', 3, true);


--
-- Name: delivery_person_zones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.delivery_person_zones_id_seq', 6, true);


--
-- Name: delivery_persons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.delivery_persons_id_seq', 2, true);


--
-- Name: delivery_zones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.delivery_zones_id_seq', 255, true);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.inventory_id_seq', 238, true);


--
-- Name: menu_item_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.menu_item_permissions_id_seq', 21, true);


--
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 19, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.notifications_id_seq', 98, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.order_items_id_seq', 34, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.orders_id_seq', 26, true);


--
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.payments_id_seq', 1, false);


--
-- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.permissions_id_seq', 40, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.product_images_id_seq', 738, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.products_id_seq', 247, true);


--
-- Name: resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.resources_id_seq', 13, true);


--
-- Name: role_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.role_permission_id_seq', 59, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.tenants_id_seq', 15, true);


--
-- Name: user_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.user_profiles_id_seq', 5, true);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.user_roles_id_seq', 24, true);


--
-- Name: user_tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.user_tenants_id_seq', 27, true);


--
-- Name: users_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.users_addresses_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jefjel_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 26, true);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: adonis_schema adonis_schema_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.adonis_schema
    ADD CONSTRAINT adonis_schema_pkey PRIMARY KEY (id);


--
-- Name: adonis_schema_versions adonis_schema_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.adonis_schema_versions
    ADD CONSTRAINT adonis_schema_versions_pkey PRIMARY KEY (version);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: categories categories_name_tenant_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_tenant_id_unique UNIQUE (name, tenant_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: category_products category_products_category_id_product_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.category_products
    ADD CONSTRAINT category_products_category_id_product_id_unique UNIQUE (category_id, product_id);


--
-- Name: category_products category_products_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.category_products
    ADD CONSTRAINT category_products_pkey PRIMARY KEY (id);


--
-- Name: deliveries deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_pkey PRIMARY KEY (id);


--
-- Name: delivery_person_zones delivery_person_zones_delivery_person_id_zone_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_person_zones
    ADD CONSTRAINT delivery_person_zones_delivery_person_id_zone_id_unique UNIQUE (delivery_person_id, zone_id);


--
-- Name: delivery_person_zones delivery_person_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_person_zones
    ADD CONSTRAINT delivery_person_zones_pkey PRIMARY KEY (id);


--
-- Name: delivery_persons delivery_persons_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_persons
    ADD CONSTRAINT delivery_persons_pkey PRIMARY KEY (id);


--
-- Name: delivery_persons delivery_persons_user_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_persons
    ADD CONSTRAINT delivery_persons_user_id_unique UNIQUE (user_id);


--
-- Name: delivery_zones delivery_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_zones
    ADD CONSTRAINT delivery_zones_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_product_id_tenant_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_tenant_id_unique UNIQUE (product_id, tenant_id);


--
-- Name: menu_item_permissions menu_item_permissions_menu_item_id_permission_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.menu_item_permissions
    ADD CONSTRAINT menu_item_permissions_menu_item_id_permission_id_unique UNIQUE (menu_item_id, permission_id);


--
-- Name: menu_item_permissions menu_item_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.menu_item_permissions
    ADD CONSTRAINT menu_item_permissions_pkey PRIMARY KEY (id);


--
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_order_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_unique UNIQUE (order_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_resource_action_tenant_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_action_tenant_id_unique UNIQUE (resource, action, tenant_id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_tenant_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_tenant_id_unique UNIQUE (sku, tenant_id);


--
-- Name: resources resources_name_tenant_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_name_tenant_id_unique UNIQUE (name, tenant_id);


--
-- Name: resources resources_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_pkey PRIMARY KEY (id);


--
-- Name: role_permission role_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_pkey PRIMARY KEY (id);


--
-- Name: role_permission role_permission_role_id_permission_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_role_id_permission_id_unique UNIQUE (role_id, permission_id);


--
-- Name: roles roles_name_tenant_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_tenant_id_unique UNIQUE (name, tenant_id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_domain_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_domain_unique UNIQUE (domain);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_slug_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_slug_unique UNIQUE (slug);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_unique UNIQUE (user_id, role_id);


--
-- Name: user_tenants user_tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_tenants
    ADD CONSTRAINT user_tenants_pkey PRIMARY KEY (id);


--
-- Name: user_tenants user_tenants_user_id_tenant_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_tenants
    ADD CONSTRAINT user_tenants_user_id_tenant_id_unique UNIQUE (user_id, tenant_id);


--
-- Name: users_addresses users_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.users_addresses
    ADD CONSTRAINT users_addresses_pkey PRIMARY KEY (id);


--
-- Name: users_addresses users_addresses_user_id_address_id_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.users_addresses
    ADD CONSTRAINT users_addresses_user_id_address_id_unique UNIQUE (user_id, address_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: cart_items_cart_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX cart_items_cart_id_index ON public.cart_items USING btree (cart_id);


--
-- Name: cart_items_product_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX cart_items_product_id_index ON public.cart_items USING btree (product_id);


--
-- Name: cart_items_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX cart_items_tenant_id_index ON public.cart_items USING btree (tenant_id);


--
-- Name: carts_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX carts_tenant_id_index ON public.carts USING btree (tenant_id);


--
-- Name: carts_user_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX carts_user_id_index ON public.carts USING btree (user_id);


--
-- Name: categories_parent_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX categories_parent_id_index ON public.categories USING btree (parent_id);


--
-- Name: categories_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX categories_tenant_id_index ON public.categories USING btree (tenant_id);


--
-- Name: deliveries_delivery_person_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX deliveries_delivery_person_id_index ON public.deliveries USING btree (delivery_person_id);


--
-- Name: deliveries_order_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX deliveries_order_id_index ON public.deliveries USING btree (order_id);


--
-- Name: delivery_person_zones_delivery_person_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX delivery_person_zones_delivery_person_id_index ON public.delivery_person_zones USING btree (delivery_person_id);


--
-- Name: delivery_person_zones_is_active_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX delivery_person_zones_is_active_index ON public.delivery_person_zones USING btree (is_active);


--
-- Name: delivery_person_zones_zone_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX delivery_person_zones_zone_id_index ON public.delivery_person_zones USING btree (zone_id);


--
-- Name: delivery_persons_is_active_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX delivery_persons_is_active_index ON public.delivery_persons USING btree (is_active);


--
-- Name: delivery_persons_is_available_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX delivery_persons_is_available_index ON public.delivery_persons USING btree (is_available);


--
-- Name: delivery_persons_rating_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX delivery_persons_rating_index ON public.delivery_persons USING btree (rating);


--
-- Name: delivery_persons_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX delivery_persons_tenant_id_index ON public.delivery_persons USING btree (tenant_id);


--
-- Name: delivery_persons_vehicle_type_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX delivery_persons_vehicle_type_index ON public.delivery_persons USING btree (vehicle_type);


--
-- Name: delivery_zones_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX delivery_zones_tenant_id_index ON public.delivery_zones USING btree (tenant_id);


--
-- Name: inventory_product_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX inventory_product_id_index ON public.inventory USING btree (product_id);


--
-- Name: inventory_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX inventory_tenant_id_index ON public.inventory USING btree (tenant_id);


--
-- Name: order_items_order_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX order_items_order_id_index ON public.order_items USING btree (order_id);


--
-- Name: order_items_product_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX order_items_product_id_index ON public.order_items USING btree (product_id);


--
-- Name: orders_status_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX orders_status_index ON public.orders USING btree (status);


--
-- Name: orders_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX orders_tenant_id_index ON public.orders USING btree (tenant_id);


--
-- Name: orders_user_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX orders_user_id_index ON public.orders USING btree (user_id);


--
-- Name: permissions_action_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX permissions_action_index ON public.permissions USING btree (action);


--
-- Name: permissions_resource_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX permissions_resource_index ON public.permissions USING btree (resource);


--
-- Name: permissions_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX permissions_tenant_id_index ON public.permissions USING btree (tenant_id);


--
-- Name: product_images_display_order_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX product_images_display_order_index ON public.product_images USING btree (display_order);


--
-- Name: product_images_is_cover_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX product_images_is_cover_index ON public.product_images USING btree (is_cover);


--
-- Name: product_images_product_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX product_images_product_id_index ON public.product_images USING btree (product_id);


--
-- Name: products_average_rating_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX products_average_rating_index ON public.products USING btree (average_rating);


--
-- Name: products_is_active_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX products_is_active_index ON public.products USING btree (is_active);


--
-- Name: products_is_marketplace_visible_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX products_is_marketplace_visible_index ON public.products USING btree (is_marketplace_visible);


--
-- Name: products_marketplace_priority_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX products_marketplace_priority_index ON public.products USING btree (marketplace_priority);


--
-- Name: products_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX products_tenant_id_index ON public.products USING btree (tenant_id);


--
-- Name: resources_is_active_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX resources_is_active_index ON public.resources USING btree (is_active);


--
-- Name: resources_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX resources_tenant_id_index ON public.resources USING btree (tenant_id);


--
-- Name: role_permission_permission_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX role_permission_permission_id_index ON public.role_permission USING btree (permission_id);


--
-- Name: role_permission_role_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX role_permission_role_id_index ON public.role_permission USING btree (role_id);


--
-- Name: roles_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX roles_tenant_id_index ON public.roles USING btree (tenant_id);


--
-- Name: tenants_domain_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX tenants_domain_index ON public.tenants USING btree (domain);


--
-- Name: tenants_status_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX tenants_status_index ON public.tenants USING btree (status);


--
-- Name: user_roles_role_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX user_roles_role_id_index ON public.user_roles USING btree (role_id);


--
-- Name: user_roles_user_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX user_roles_user_id_index ON public.user_roles USING btree (user_id);


--
-- Name: user_tenants_tenant_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX user_tenants_tenant_id_index ON public.user_tenants USING btree (tenant_id);


--
-- Name: user_tenants_user_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX user_tenants_user_id_index ON public.user_tenants USING btree (user_id);


--
-- Name: users_addresses_address_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX users_addresses_address_id_index ON public.users_addresses USING btree (address_id);


--
-- Name: users_addresses_user_id_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX users_addresses_user_id_index ON public.users_addresses USING btree (user_id);


--
-- Name: users_email_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX users_email_index ON public.users USING btree (email);


--
-- Name: users_status_index; Type: INDEX; Schema: public; Owner: jefjel_owner
--

CREATE INDEX users_status_index ON public.users USING btree (status);


--
-- Name: addresses addresses_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: addresses addresses_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_zone_id_foreign FOREIGN KEY (zone_id) REFERENCES public.delivery_zones(id);


--
-- Name: cart_items cart_items_cart_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_foreign FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: cart_items cart_items_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: carts carts_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: carts carts_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: categories categories_parent_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_foreign FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: categories categories_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: category_products category_products_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.category_products
    ADD CONSTRAINT category_products_category_id_foreign FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: category_products category_products_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.category_products
    ADD CONSTRAINT category_products_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: deliveries deliveries_delivery_person_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_delivery_person_id_foreign FOREIGN KEY (delivery_person_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: deliveries deliveries_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: delivery_person_zones delivery_person_zones_delivery_person_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_person_zones
    ADD CONSTRAINT delivery_person_zones_delivery_person_id_foreign FOREIGN KEY (delivery_person_id) REFERENCES public.delivery_persons(id) ON DELETE CASCADE;


--
-- Name: delivery_person_zones delivery_person_zones_zone_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_person_zones
    ADD CONSTRAINT delivery_person_zones_zone_id_foreign FOREIGN KEY (zone_id) REFERENCES public.delivery_zones(id) ON DELETE CASCADE;


--
-- Name: delivery_persons delivery_persons_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_persons
    ADD CONSTRAINT delivery_persons_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: delivery_persons delivery_persons_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_persons
    ADD CONSTRAINT delivery_persons_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: delivery_zones delivery_zones_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.delivery_zones
    ADD CONSTRAINT delivery_zones_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: inventory inventory_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: inventory inventory_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: menu_item_permissions menu_item_permissions_menu_item_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.menu_item_permissions
    ADD CONSTRAINT menu_item_permissions_menu_item_id_foreign FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE CASCADE;


--
-- Name: menu_item_permissions menu_item_permissions_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.menu_item_permissions
    ADD CONSTRAINT menu_item_permissions_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: menu_items menu_items_parent_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_parent_id_foreign FOREIGN KEY (parent_id) REFERENCES public.menu_items(id) ON DELETE CASCADE;


--
-- Name: menu_items menu_items_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE SET NULL;


--
-- Name: notifications notifications_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: orders orders_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_address_id_foreign FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- Name: orders orders_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: orders orders_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_order_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_foreign FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: permissions permissions_resource_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_resource_id_fkey FOREIGN KEY (resource_id) REFERENCES public.resources(id) ON DELETE CASCADE;


--
-- Name: permissions permissions_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: product_images product_images_product_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_product_id_foreign FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products products_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: resources resources_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.resources
    ADD CONSTRAINT resources_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: role_permission role_permission_permission_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_permission_id_foreign FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permission role_permission_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.role_permission
    ADD CONSTRAINT role_permission_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: roles roles_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: user_profiles user_profiles_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_tenants user_tenants_tenant_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_tenants
    ADD CONSTRAINT user_tenants_tenant_id_foreign FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: user_tenants user_tenants_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.user_tenants
    ADD CONSTRAINT user_tenants_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users_addresses users_addresses_address_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.users_addresses
    ADD CONSTRAINT users_addresses_address_id_foreign FOREIGN KEY (address_id) REFERENCES public.addresses(id) ON DELETE CASCADE;


--
-- Name: users_addresses users_addresses_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: jefjel_owner
--

ALTER TABLE ONLY public.users_addresses
    ADD CONSTRAINT users_addresses_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

