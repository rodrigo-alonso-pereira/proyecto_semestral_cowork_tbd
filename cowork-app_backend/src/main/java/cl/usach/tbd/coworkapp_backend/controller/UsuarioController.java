package cl.usach.tbd.coworkapp_backend.controller;

import cl.usach.tbd.coworkapp_backend.dto.HorasRestantesDTO;
import cl.usach.tbd.coworkapp_backend.dto.LoginRequestDTO;
import cl.usach.tbd.coworkapp_backend.dto.LoginResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.UsuarioCreateDTO;
import cl.usach.tbd.coworkapp_backend.dto.UsuarioResponseDTO;
import cl.usach.tbd.coworkapp_backend.dto.UsuarioUpdateDTO;
import cl.usach.tbd.coworkapp_backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/usuario")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * GET /api/v1/usuario
     * Obtener todos los usuarios
     */
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> getAllUsuarios() {
        try {
            List<UsuarioResponseDTO> usuarios = usuarioService.getAllUsuarios();
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/usuario/{id}
     * Obtener un usuario por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioById(@PathVariable Long id) {
        try {
            UsuarioResponseDTO usuario = usuarioService.getUsuarioById(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/v1/usuario
     * Crear un nuevo usuario
     */
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> createUsuario(@RequestBody UsuarioCreateDTO createDTO) {
        try {
            UsuarioResponseDTO usuario = usuarioService.createUsuario(createDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /api/v1/usuario/{id}
     * Actualizar un usuario existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> updateUsuario(
            @PathVariable Long id,
            @RequestBody UsuarioUpdateDTO updateDTO) {
        try {
            UsuarioResponseDTO usuario = usuarioService.updateUsuario(id, updateDTO);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /api/v1/usuario/{id}
     * Eliminar un usuario (borrado lógico - cambia estado a "Eliminado")
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> deleteUsuario(@PathVariable Long id) {
        try {
            UsuarioResponseDTO usuario = usuarioService.deleteUsuario(id);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/usuario/rut/{rut}
     * Obtener usuario por RUT
     */
    @GetMapping("/rut/{rut}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioByRut(@PathVariable String rut) {
        try {
            UsuarioResponseDTO usuario = usuarioService.getUsuarioByRut(rut);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/usuario/email/{email}
     * Obtener usuario por email
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioResponseDTO> getUsuarioByEmail(@PathVariable String email) {
        try {
            UsuarioResponseDTO usuario = usuarioService.getUsuarioByEmail(email);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/usuario/estado/{estadoUsuarioId}
     * Obtener usuarios por estado
     */
    @GetMapping("/estado/{estadoUsuarioId}")
    public ResponseEntity<List<UsuarioResponseDTO>> getUsuariosByEstadoUsuarioId(@PathVariable Long estadoUsuarioId) {
        try {
            List<UsuarioResponseDTO> usuarios = usuarioService.getUsuariosByEstadoUsuarioId(estadoUsuarioId);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/usuario/tipo/{tipoUsuarioId}
     * Obtener usuarios por tipo de usuario
     */
    @GetMapping("/tipo/{tipoUsuarioId}")
    public ResponseEntity<List<UsuarioResponseDTO>> getUsuariosByTipoUsuarioId(@PathVariable Long tipoUsuarioId) {
        try {
            List<UsuarioResponseDTO> usuarios = usuarioService.getUsuariosByTipoUsuarioId(tipoUsuarioId);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/usuario/plan/{planId}
     * Obtener usuarios por plan
     */
    @GetMapping("/plan/{planId}")
    public ResponseEntity<List<UsuarioResponseDTO>> getUsuariosByPlanId(@PathVariable Long planId) {
        try {
            List<UsuarioResponseDTO> usuarios = usuarioService.getUsuariosByPlanId(planId);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/usuario/nombre/{nombre}
     * Buscar usuarios por nombre (búsqueda parcial, case-insensitive)
     */
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<UsuarioResponseDTO>> getUsuariosByNombre(@PathVariable String nombre) {
        try {
            List<UsuarioResponseDTO> usuarios = usuarioService.getUsuariosByNombre(nombre);
            return ResponseEntity.ok(usuarios);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/v1/usuario/login
     * Login de usuario con email y password
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            LoginResponseDTO response = usuarioService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/v1/usuario/{id}/horas-restantes
     * Obtener horas restantes del plan del usuario en el mes actual
     */
    @GetMapping("/{id}/horas-restantes")
    public ResponseEntity<HorasRestantesDTO> getHorasRestantesMesActual(@PathVariable Long id) {
        try {
            HorasRestantesDTO horasRestantes = usuarioService.getHorasRestantesMesActual(id);
            return ResponseEntity.ok(horasRestantes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

