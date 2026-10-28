pub mod start;
pub mod locate;
pub mod settings;
pub mod commands;

pub mod prdset;

use tauri::{Emitter, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let first_arg = std::env::args().nth(1).map(std::path::PathBuf::from);
    tauri::Builder::default()
        // A second launch (prdf while the viewer is open) sends its path to this window.
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            let settings = settings::load_settings(&commands::settings_path(app));
            let view = start::start_view(argv.get(1).map(std::path::Path::new), &settings);
            let _ = app.emit("start", view);
            if let Some(w) = app.get_webview_window("main") {
                let _ = w.set_focus();
            }
        }))
        .plugin(tauri_plugin_dialog::init())
        .manage(commands::StartArg(std::sync::Mutex::new(first_arg)))
        .invoke_handler(tauri::generate_handler![commands::open_set, commands::startup])
        .run(tauri::generate_context!())
        .expect("error while running the PRD Forge Viewer");
}
