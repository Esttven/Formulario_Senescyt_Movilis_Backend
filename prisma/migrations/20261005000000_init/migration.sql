-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."estudiantes" (
    "id" SERIAL NOT NULL,
    "tipo_documento" TEXT NOT NULL,
    "numero_identificacion" TEXT NOT NULL,
    "primer_apellido" TEXT NOT NULL,
    "segundo_apellido" TEXT NOT NULL,
    "primer_nombre" TEXT NOT NULL,
    "segundo_nombre" TEXT NOT NULL,
    "sexo" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "estado_civil" TEXT NOT NULL,
    "etnia" TEXT NOT NULL,
    "tipo_sangre" TEXT NOT NULL,
    "discapacidad" TEXT NOT NULL,
    "porcentaje_discapacidad" TEXT,
    "num_carnet_conadis" TEXT,
    "tipo_discapacidad" TEXT,
    "fecha_nacimiento" DATE NOT NULL,
    "pais_nacionalidad_id" TEXT,
    "provincia_nacimiento_id" TEXT,
    "canton_nacimiento_id" TEXT,
    "pais_residencia_id" TEXT,
    "provincia_residencia_id" TEXT,
    "canton_residencia_id" TEXT,
    "nacionalidad_id" TEXT,
    "pueblo_id" TEXT,
    "tipo_colegio_id" TEXT,
    "colegio_procedencia_id" TEXT,
    "nombre_colegio_procedencia" VARCHAR(200),
    "titulo_bachiller" TEXT,
    "anio_graduacion" INTEGER,
    "modalidad_carrera" TEXT,
    "jornada_carrera" TEXT,
    "fecha_inicio_carrera" DATE,
    "fecha_matricula" DATE,
    "tipo_matricula" TEXT,
    "duracion_periodo_academico" INTEGER,
    "nivel_academico" TEXT,
    "ha_repetido_al_menos_una_materia" TEXT,
    "paralelo" TEXT,
    "ha_perdido_la_gratuidad" TEXT,
    "recibe_pension_diferenciada" TEXT,
    "carrera" TEXT,
    "diseno_curricular" TEXT,
    "periodo_academico" TEXT,
    "estudiante_ocupacion" TEXT,
    "trabajo_especifique" VARCHAR(200),
    "ingresos_estudiante" TEXT,
    "bono_desarrollo" TEXT,
    "ha_realizado_practicas_preprofesionales" TEXT,
    "nro_horas_practicas_preprofesionales_por_periodo" INTEGER,
    "entorno_institucional_practicas_profesionales" TEXT,
    "sector_economico_practica_profesional" TEXT,
    "tipo_beca" TEXT,
    "primera_razon_beca" TEXT,
    "segunda_razon_beca" TEXT,
    "tercera_razon_beca" TEXT,
    "cuarta_razon_beca" TEXT,
    "quinta_razon_beca" TEXT,
    "sexta_razon_beca" TEXT,
    "monto_beca" DECIMAL(12,2),
    "porcentaje_beca_cobertura_arancel" DECIMAL(5,2),
    "porcentaje_beca_cobertura_manutencion" DECIMAL(5,2),
    "financiamiento_beca" TEXT,
    "monto_ayuda_economica" DECIMAL(12,2),
    "monto_credito_educativo" DECIMAL(12,2),
    "financiamiento_fondos_propios" BOOLEAN NOT NULL DEFAULT false,
    "financiamiento_ayuda_padres" BOOLEAN NOT NULL DEFAULT false,
    "financiamiento_tarjeta_credito" BOOLEAN NOT NULL DEFAULT false,
    "financiamiento_entidad_financiera" BOOLEAN NOT NULL DEFAULT false,
    "financiamiento_terceras_personas" BOOLEAN NOT NULL DEFAULT false,
    "financiamiento_quienes" VARCHAR(200),
    "participa_en_proyecto_vinculacion_sociedad" TEXT,
    "tipo_alcance_proyecto_vinculacion" TEXT,
    "correo_electronico" TEXT,
    "correo_institucional" TEXT,
    "numero_celular" TEXT,
    "numero_convencional" TEXT,
    "direccion_domicilio" TEXT,
    "lugar_residencia" TEXT,
    "referencia_domiciliaria" TEXT,
    "parroquia_procedencia" TEXT,
    "parroquia_residencia" TEXT,
    "barrio_sector" TEXT,
    "pais_procedencia_extranjero" TEXT,
    "estado_provincia_procedencia" TEXT,
    "canton_procedencia" TEXT,
    "barrio_sector_procedencia" TEXT,
    "direccion_domicilio_procedencia" TEXT,
    "alergias" TEXT,
    "presenta_alergia_importante" TEXT,
    "medicamentos" TEXT,
    "enfermedad_catastrofica" TEXT,
    "presenta_carnet_discapacidad" TEXT,
    "referencia_personal_nombre" TEXT,
    "referencia_personal_parentesco" TEXT,
    "referencia_personal_telefono" TEXT,
    "referencia_personal_correo" TEXT,
    "contacto_emergencia_nombre" TEXT,
    "contacto_emergencia_parentesco" TEXT,
    "contacto_emergencia_telefono" TEXT,
    "contacto_emergencia_correo" TEXT,
    "nivel_formacion_padre" TEXT,
    "nivel_formacion_madre" TEXT,
    "ingreso_total_hogar" DECIMAL(12,2),
    "cantidad_miembros_hogar" INTEGER,
    "zona_vivienda" TEXT,
    "coordenadas_vivienda" TEXT,
    "croquis_vivienda_url" TEXT,
    "tipo_propiedad_vivienda" TEXT,
    "estructura_vivienda" TEXT,
    "estructura_vivienda_especifique" TEXT,
    "tipo_vivienda" TEXT,
    "servicios_disponibles" TEXT,
    "servicio_energia_electrica" BOOLEAN,
    "servicio_agua_potable" BOOLEAN,
    "servicio_alcantarillado" BOOLEAN,
    "servicio_telefono_fijo" BOOLEAN,
    "servicio_internet" BOOLEAN,
    "servicio_tv_cable" BOOLEAN,
    "servicio_plan_datos" BOOLEAN,
    "cantidad_banos" INTEGER,
    "cantidad_habitaciones" INTEGER,
    "comparte_habitacion" TEXT,
    "con_quien_vive" TEXT,
    "tamano_vivienda_suficiente" TEXT,
    "dinamica_familiar" TEXT,
    "violencia_familiar" TEXT,
    "tipo_violencia_familiar" TEXT,
    "estudiante_cabeza_familiar" TEXT,
    "familia_discapacidad_enfermedad_catastrofica" TEXT,
    "familia_problema_salud" TEXT,
    "familia_parentesco" TEXT,
    "familia_servicios_medicos" TEXT,
    "familia_servicios_medicos_detalle" TEXT,
    "egreso_vivienda" DECIMAL(12,2),
    "egreso_alimentacion" DECIMAL(12,2),
    "egreso_educacion" DECIMAL(12,2),
    "egreso_indumentaria" DECIMAL(12,2),
    "egreso_transporte" DECIMAL(12,2),
    "egreso_salud" DECIMAL(12,2),
    "egreso_servicios_basicos" DECIMAL(12,2),
    "egreso_otros" DECIMAL(12,2),
    "total_egresos" DECIMAL(12,2),
    "tipo_comprobante" TEXT,
    "facturacion_nombre" TEXT,
    "facturacion_tipo_identificacion" TEXT,
    "facturacion_identificacion" TEXT,
    "facturacion_direccion" TEXT,
    "facturacion_correo" TEXT,
    "facturacion_telefono" TEXT,
    "mantener_datos_facturacion" TEXT,
    "copia_cedula" TEXT,
    "copia_papeleta" TEXT,
    "certificado_registro_titulo" TEXT,
    "justificacion_retraso_documentos" TEXT,
    "registro_ficha_estudiantil_completado" BOOLEAN NOT NULL DEFAULT false,
    "registro_ficha_socioeconomica_completado" BOOLEAN NOT NULL DEFAULT false,
    "registro_datos_facturacion_completado" BOOLEAN NOT NULL DEFAULT false,
    "estado_registro" TEXT NOT NULL DEFAULT 'PENDIENTE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sector_economico_id" TEXT,

    CONSTRAINT "estudiantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."composicion_familiar" (
    "id" SERIAL NOT NULL,
    "estudiante_id" INTEGER NOT NULL,
    "nombres_apellidos" VARCHAR(200) NOT NULL,
    "fecha_nacimiento" DATE,
    "cedula_identidad" VARCHAR(13),
    "estadoCivil" TEXT,
    "parentesco" TEXT,
    "nivel_estudios" TEXT,
    "titulo" VARCHAR(120),
    "labor_ocupacion" VARCHAR(120),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "composicion_familiar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ingresos_familiares" (
    "id" SERIAL NOT NULL,
    "estudiante_id" INTEGER NOT NULL,
    "nombres_apellidos" VARCHAR(200) NOT NULL,
    "parentesco" TEXT,
    "actividad_laboral" VARCHAR(120),
    "ingreso_mensual" DECIMAL(12,2),
    "ingresos_extras" DECIMAL(12,2),
    "total" DECIMAL(12,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ingresos_familiares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documentos" (
    "id" SERIAL NOT NULL,
    "estudiante_id" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "storage_key" TEXT,
    "mime_type" TEXT,
    "size_bytes" BIGINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."paises" (
    "id" TEXT NOT NULL,
    "codigo" INTEGER,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "paises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."provincias" (
    "id" TEXT NOT NULL,
    "codigo" INTEGER,
    "nombre" TEXT NOT NULL,
    "pais_id" TEXT NOT NULL,

    CONSTRAINT "provincias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cantones" (
    "id" TEXT NOT NULL,
    "codigo" INTEGER,
    "nombre" TEXT NOT NULL,
    "provincia_id" TEXT NOT NULL,

    CONSTRAINT "cantones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pueblos_nacionalidades" (
    "id" TEXT NOT NULL,
    "codigo" INTEGER,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,

    CONSTRAINT "pueblos_nacionalidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sectores_economicos" (
    "id" TEXT NOT NULL,
    "codigo" INTEGER,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "sectores_economicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."colegios" (
    "id" TEXT NOT NULL,
    "codigo" INTEGER,
    "nombre" TEXT NOT NULL,
    "provincia" TEXT,
    "canton" TEXT,
    "sostenimiento" TEXT,

    CONSTRAINT "colegios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "estudiantes_numero_identificacion_idx" ON "public"."estudiantes"("numero_identificacion");

-- CreateIndex
CREATE INDEX "estudiantes_estado_registro_idx" ON "public"."estudiantes"("estado_registro");

-- CreateIndex
CREATE UNIQUE INDEX "estudiantes_tipo_documento_numero_identificacion_key" ON "public"."estudiantes"("tipo_documento", "numero_identificacion");

-- CreateIndex
CREATE INDEX "composicion_familiar_estudiante_id_idx" ON "public"."composicion_familiar"("estudiante_id");

-- CreateIndex
CREATE INDEX "ingresos_familiares_estudiante_id_idx" ON "public"."ingresos_familiares"("estudiante_id");

-- CreateIndex
CREATE INDEX "documentos_estudiante_id_tipo_idx" ON "public"."documentos"("estudiante_id", "tipo");

-- CreateIndex
CREATE INDEX "provincias_pais_id_idx" ON "public"."provincias"("pais_id");

-- CreateIndex
CREATE INDEX "cantones_provincia_id_idx" ON "public"."cantones"("provincia_id");

-- CreateIndex
CREATE INDEX "pueblos_nacionalidades_tipo_idx" ON "public"."pueblos_nacionalidades"("tipo");

-- CreateIndex
CREATE INDEX "colegios_provincia_canton_idx" ON "public"."colegios"("provincia", "canton");

-- AddForeignKey
ALTER TABLE "public"."estudiantes" ADD CONSTRAINT "estudiantes_pais_nacionalidad_id_fkey" FOREIGN KEY ("pais_nacionalidad_id") REFERENCES "public"."paises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estudiantes" ADD CONSTRAINT "estudiantes_pais_residencia_id_fkey" FOREIGN KEY ("pais_residencia_id") REFERENCES "public"."paises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estudiantes" ADD CONSTRAINT "estudiantes_provincia_nacimiento_id_fkey" FOREIGN KEY ("provincia_nacimiento_id") REFERENCES "public"."provincias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estudiantes" ADD CONSTRAINT "estudiantes_provincia_residencia_id_fkey" FOREIGN KEY ("provincia_residencia_id") REFERENCES "public"."provincias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estudiantes" ADD CONSTRAINT "estudiantes_canton_nacimiento_id_fkey" FOREIGN KEY ("canton_nacimiento_id") REFERENCES "public"."cantones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estudiantes" ADD CONSTRAINT "estudiantes_canton_residencia_id_fkey" FOREIGN KEY ("canton_residencia_id") REFERENCES "public"."cantones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estudiantes" ADD CONSTRAINT "estudiantes_nacionalidad_id_fkey" FOREIGN KEY ("nacionalidad_id") REFERENCES "public"."pueblos_nacionalidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estudiantes" ADD CONSTRAINT "estudiantes_pueblo_id_fkey" FOREIGN KEY ("pueblo_id") REFERENCES "public"."pueblos_nacionalidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estudiantes" ADD CONSTRAINT "estudiantes_sector_economico_id_fkey" FOREIGN KEY ("sector_economico_id") REFERENCES "public"."sectores_economicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."estudiantes" ADD CONSTRAINT "estudiantes_colegio_procedencia_id_fkey" FOREIGN KEY ("colegio_procedencia_id") REFERENCES "public"."colegios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."composicion_familiar" ADD CONSTRAINT "composicion_familiar_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "public"."estudiantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ingresos_familiares" ADD CONSTRAINT "ingresos_familiares_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "public"."estudiantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documentos" ADD CONSTRAINT "documentos_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "public"."estudiantes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."provincias" ADD CONSTRAINT "provincias_pais_id_fkey" FOREIGN KEY ("pais_id") REFERENCES "public"."paises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cantones" ADD CONSTRAINT "cantones_provincia_id_fkey" FOREIGN KEY ("provincia_id") REFERENCES "public"."provincias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
